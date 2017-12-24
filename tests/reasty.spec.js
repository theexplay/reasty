import test from 'ava';
import mock from 'mock-fs';
import sinon from 'sinon'
import fs from 'fs-extra';

const Reasty = require('./../lib/reasty');

const sample = 'sampleFile';
const reasty = new Reasty([sample]);

test('reasty init, with component', t => {
    t.deepEqual(reasty.components, [sample]);
});

test('reasty create, конфиг не существует', t => {
    const reasty2 = new Reasty([sample]); // костыль
    const spy = sinon.spy(fs, 'pathExists');

    sinon.stub(reasty2, '_getConfigFile').returns(false);

    t.false(reasty2.create());
    t.false(spy.called);
});

test('reasty create, конфиг существует, но произошла ошибка при проверке пути', async t => {
    const reasty2 = new Reasty([sample]); // костыль
    const errorMessage = 'Some message';
    const error = new Error(errorMessage);

    sinon.stub(fs, 'pathExists').throws(error);
    await t.throws(() => {
        reasty2.create()
    }, errorMessage);
});

test('reasty create, конфиг существует, директория уже занята', t => {
    const reasty2 = new Reasty([sample]); // костыль
    sinon.stub(fs, 'pathExists').resolves(true);

    // проверка на undefined
    t.falsy(reasty2.create());
});

test('reasty create, конфиг существует, директория доступна для записи', t => {
    const reasty2 = new Reasty([sample]); // костыль
    const spyWriteFileList = sinon.stub(reasty2, '_writeFilesList').returns(true);
    sinon.stub(fs, 'pathExists').resolves(false);


    // @todo криво работает тест

    t.falsy(reasty2.create());
    // console.log(spyWriteFileList)
    // sinon.assert.calledOnce(spyWriteFileList);
});

test('reasty _getConfigFile, используем невалидный/несуществующий json', t => {
    mock({'.reastyrc': ''});

    t.false(reasty._getConfigFile());
});

test('reasty _getConfigFile, файл существует и валиден', t => {
    mock({'.reastyrc': '{"test": 123}'});

    t.true(reasty._getConfigFile());
});

test('reasty _replaceVars, заменяем переменные в "шаблоне"', t => {
    const sample = 'sampleFile';
    const reasty = new Reasty([sample]);
    const template = ".{{NAME}}{{NEWLINE}}{{INDENT}}// your code here{{NEWLINE}}";
    const vars = {
        'NAME': sample,
        'NEWLINE': '/t',
        'INDENT': '  '
    };
    const result = '.sampleFile/t  // your code here/t';

    t.is(reasty._replaceVars(template, vars), result);
});
