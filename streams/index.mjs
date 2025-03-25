import fs from 'fs';
import { Readable, Writable, Transform } from 'stream';
import { format } from 'date-fns';

function createTimeStream() {
  const timeStream = new Readable({
    read() {},
  });

  setInterval(() => {
    const timeNow = new Date().toISOString();
    timeStream.push(timeNow);
  }, 1000);

  return timeStream;
}

function formatTimeStream() {
  return new Transform({
    transform(chunk, encode, callback) {
      const formattedTime = format(new Date(chunk.toString()), 'yyyy-MM-dd HH:mm:ss') + '\n';
      this.push(formattedTime);
      console.log(`${formattedTime.trim()} was appended to time-log.txt`);
      callback();
    },
  });
}

function createOutputFileStream() {
  const fileStream = fs.createWriteStream('./streams/time-log.txt', { flags: 'a' });
  return new Writable({
    write(chunk, encode, callback) {
      fileStream.write(chunk, callback);
    },
  });
}

function startStream() {
  const timeStream = createTimeStream();
  const formattedTimeStream = formatTimeStream();
  const fileStream = createOutputFileStream();

  timeStream.pipe(formattedTimeStream).pipe(fileStream);

  timeStream.on('end', () => console.log('Stream complete!'));
}

startStream();
