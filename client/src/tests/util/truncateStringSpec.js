import chai from 'chai';
import truncateString from '../../util/truncateString';

const expect = chai.expect;

describe('getReadableAccessType', () => {
  it('should return nothing when fed with invalid arguments (a non-string argument or a truncation length that\'s less than 0)', () => {
    let text = { random: 'foo' };
    let truncationLength = 6;
    let truncated = truncateString(text, truncationLength);
    expect(truncated).to.equal(undefined);

    text = 'Random text.';
    truncationLength = -1;
    truncated = truncateString(text, truncationLength);
    expect(truncated).to.equal(undefined);
  });

  it('should return the original text if its length is less than the limit/truncation length', () => {
    const text = 'Random text.';
    const truncationLength = 50;
    const truncated = truncateString(text, truncationLength);
    expect(truncated).to.equal(text);
  });

  it('should return truncated text followed by an ellipsis (...) for text longer than the limit/truncation length', () => {
    const text = 'Random text.';
    const truncationLength = 7;
    const truncated = truncateString(text, truncationLength);
    expect(truncated).to.equal(`${text.substr(0, truncationLength)}...`);
  });
});
