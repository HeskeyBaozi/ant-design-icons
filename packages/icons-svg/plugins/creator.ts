import through from 'through2';
import File from 'vinyl';

export const createTrasformStream = (fn: (raw: string) => string) =>
  through.obj((file: File, encoding, done) => {
    if (file.isBuffer()) {
      const before = file.contents.toString(encoding);
      try {
        const after = fn(before);
        file.contents = Buffer.from(after);
        done(null, file);
      } catch (err) {
        done(err, file);
      }
    } else {
      done(null, file);
    }
  });

export const createTrasformStreamAsync = (
  fn: (raw: string) => Promise<string>
) =>
  through.obj((file: File, encoding, done) => {
    if (file.isBuffer()) {
      const before = file.contents.toString(encoding);
      fn(before)
        .then((after) => {
          file.contents = Buffer.from(after);
          done(null, file);
        })
        .catch((err) => {
          done(err, file);
        });
    } else {
      done(null, file);
    }
  });
