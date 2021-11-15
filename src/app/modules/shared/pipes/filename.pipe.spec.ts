import { FileNamePipe } from "./filename.pipe";

describe('FileNamePipe', () => {
    it('properly truncates a filename when setting max length to 22', () => {
      const pipe = new FileNamePipe();
      const original = 'keystore-m_12381_3600_0_0_0-1636471397.json';
      expect(pipe.transform(original,22)).toEqual('keystor...6471397.json');
    });

    it('properly returns a filename if it is too short', () => {
        const pipe = new FileNamePipe();
        const original = 'key.json';
        expect(pipe.transform(original,22)).toEqual('key.json');
      });
  });