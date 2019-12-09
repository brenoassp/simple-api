const config = require('./config');
const mongoose = require('mongoose');
const redis = require('redis');
const bluebird = require('bluebird');
const Event = require('./models/event');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

bluebird.promisifyAll(redis);

const SEED_MONGO_QUANTITY = 10000
const LOAD_CHUNK = 50;
const COMPLETIONS_LIMIT = 20;

class AutoComplete {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  static build() {
    let redisClient = redis.createClient({
      port: config.redis.port,
      host: config.redis.host
    });

    return new Promise((resolve, reject) => {
      mongoose.connect(
        config.database.url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        (err, db) => {
          if (err) {
            reject(err);
            return;
          }
          let autoComplete = new AutoComplete(redisClient);
          mongoose.connection.db
            .collection("events")
            .countDocuments((err, count) => {
              if (err) {
                console.log(err);
                return;
              }
              if (count === 0) {
                autoComplete.seedMongo("data/words.txt");
                resolve(autoComplete);
              } else {
                console.log("it is connected to mongodb");
                autoComplete.redisIsEmpty().then(isEmpty => {
                  if (isEmpty) {
                    autoComplete.loadRedis();
                  }
                });
                resolve(autoComplete);
              }
            });
        }
      );
    });
  }

  async addEventToRedis(event) {
    for (
      let letterIndex = 0;
      letterIndex < event.length - 1;
      letterIndex++
    ) {
      let prefix = event.substring(0, letterIndex + 1);
      this.redisClient.zaddAsync("events", 0, prefix);
    }
    let eventName = event + "%";
    this.redisClient.zaddAsync("events", 0, eventName);
  }

  async loadRedis() {
    console.log("load redis function is running");

    this.getAllEvents().then(events => {
      for (let index = 0; index < events.length; index++) {
        let event = events[index].event;
        for (
          let letterIndex = 0;
          letterIndex < event.length - 1;
          letterIndex++
        ) {
          let prefix = event.substring(0, letterIndex + 1);
          this.redisClient.zaddAsync("events", 0, prefix);
        }
        let eventName = event + "%";
        this.redisClient.zaddAsync("events", 0, eventName);
      }
      console.log("all events were imported to redis");
    });
  }

  async getAllEvents() {
    return Event.find();
  }

  async seedMongo(file) {
    let self = this;
    console.log("importing words");
    var instream = fs.createReadStream(file);
    var outstream = new stream();
    var rl = readline.createInterface(instream, outstream);
    let words = [];
    rl.on("line", async word => {
      words.push(new Event({ event: word }));
    });
    rl.on("close", async () => {
      Event.collection.insertMany(
        words.slice(0, SEED_MONGO_QUANTITY),
        async (err, docs) => {
          if (err) {
            console.log("error trying to seed database");
            return;
          }
          console.log("words imported successfully");
          let isEmpty = await self.redisIsEmpty();
          if (isEmpty) {
            self.loadRedis();
          }
        }
      );
    });    
  }

  async redisIsEmpty() {
    return ! await this.redisClient.zcardAsync("events");
  }

  async addEvent(event) {
    try {
      await event.save();
      console.log("event saved");
      this.addEventToRedis(event.event);
    } catch (err) {
      console.log("error saving event");
    }
  }

  async getCompletions (prefix, limit = COMPLETIONS_LIMIT) {
    let completions = [];
    let finish = false;
    let prefixIndex = await this.redisClient.zrankAsync('events', prefix);
    if (prefixIndex === null || !(prefixIndex >= 0)) {
      console.log('there is no event with this prefix');
      return [];
    }
    let start = prefixIndex;
    let possibleCompletions = await this.redisClient.zrangeAsync('events', start, start + LOAD_CHUNK-1)
    if (possibleCompletions.length === 0) {
      finish = true;
    }
    while (!finish) {
      for (let index = 0; index < possibleCompletions.length && !finish; index++) {
        let possibleCompletion = possibleCompletions[index];
        if (!possibleCompletion.startsWith(prefix)) {
          finish = true;
        } else if (possibleCompletion.endsWith('%')) {
          completions.push(possibleCompletion.slice(0, -1));
          if (completions.length === limit) {
            finish = true;
          }
        }
      }
      if (!finish) {
        start += LOAD_CHUNK;
        possibleCompletions = await this.redisClient.zrangeAsync('events', start, start + LOAD_CHUNK-1)  
      }
    }
    return completions;
  };
}

module.exports = AutoComplete.build();