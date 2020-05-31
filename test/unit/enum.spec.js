'use strict';

const expect      = require('chai').expect;
const bacnetEnum  = require('../../lib/enum');

describe('bacnet - ENUM tests', (done) => {
  it('enum get name of BOOLEAN should be defined with 1', () => {
    expect(bacnetEnum.getEnumName(bacnetEnum.ApplicationTag, 1, false)).to.be.equal(bacnetEnum.ApplicationTagName[1]);
  });

  it('enum get name of BOOLEAN(1) should be defined with 1', () => {
    expect(bacnetEnum.getEnumName(bacnetEnum.ApplicationTag, 1)).to.be.equal('BOOLEAN(1)');
  });

  it('enum get undefined with -1', () => {
    expect(bacnetEnum.getEnumName(bacnetEnum.ApplicationTag, -1, false)).to.be.equal('-1');
  });
});
