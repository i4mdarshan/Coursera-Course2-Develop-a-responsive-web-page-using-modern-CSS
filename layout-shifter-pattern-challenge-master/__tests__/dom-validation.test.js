const path = require('path');
const { readFileSync } = require('fs');
const { JSDOM } = require('jsdom');

let document;
beforeAll(() => {
    const htmlFile = readFileSync(path.join(__dirname, '../index.html'), 'utf-8');
    const dom = new JSDOM(htmlFile, { contentType: 'text/html' });
    document = dom.window.document;
    global.dom = dom;
});

test('Should check that embedded style sheets are not used', () => {
    const styleTag = document.getElementsByTagName('style');
    console.log(styleTag.length);
    expect(styleTag.length).toEqual(0);
});

test('Should check if link tag is used referring to an external file within the project', () => {
    const linkTag = document.getElementsByTagName('link');
    let href_value;
    if (linkTag != undefined) {
        for (i = 0; i < linkTag.length; i++) {
            href_value = document.getElementsByTagName('link')[i].attributes.getNamedItem("href").value;
            if (!href_value.match(/http/))
                break;
        }
        expect(href_value).not.toMatch(/http/);
    }
});

test('Should check if there are main, nav and ul semantic elements present',()=>{
    const main_element=document.getElementsByTagName('main');
    expect(main_element.length).toEqual(1);
    const nav_element=document.getElementsByTagName('nav');
    expect(nav_element.length).toEqual(1);
    const list_element=document.getElementsByTagName('ul');
    expect(list_element.length).toBeGreaterThanOrEqual(1);
});

test('should check if 6 anchor elements are present and are child of nav',()=>{
    const main_element=document.getElementsByTagName('a');
    expect(main_element.length).toBeGreaterThanOrEqual(6);
    const parent=document.querySelector('a').parentElement.nodeName;
    expect(parent).toEqual('NAV');
});

test('Should Check class/id values should not have dot/hash ', () => {
    let attr_value = document.getElementsByTagName('div')[0].attributes[0].value;
    expect(attr_value).not.toMatch(/^(\.|#)/);
});