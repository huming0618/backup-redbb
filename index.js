const puppeteer = require('puppeteer');

const Mode = { INIT: 0, TO_LOGIN: 1, LOGIN_DONE: 2, POST_HOMEPAGE: 3, READ_POSTLIST: 4 };

let mode = Mode.INIT;

const setMode = (nextMode)=>{
    mode = nextMode;
}



const main = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    const readPost = async (url)=>{
        console.log(url);
        await page.goto(url);
        const content = await page.evaluate(() => {
            return {
                title: document.getElementById('post_title').value,
                body: document.getElementById('content_ifr').contentWindow.document.body.innerHTML
            };
        });
        console.log(content.title);
        console.log(content.body);
        //
    }

    const readPostList = async ()=>{
        setMode(Mode.READ_POSTLIST);
        const postFormURLList = await page.evaluate(() => {
            const list = Array.from(document.querySelectorAll('td.align-left.PLtitle > a'));
            return list.map(x=>x.href);
        });
        console.log('postFormURLList[0]', postFormURLList[0]);
        readPost(postFormURLList[0]);
    }

    page.on('load', ()=>{

    });

    page.on('response', async (resp)=>{
        const url = resp.url();
        if (mode === Mode.TO_LOGIN && url.indexOf('home.blogbus.com') > 0){
            setMode(Mode.LOGIN_DONE);
            await page.goto('http://blog.home.blogbus.com/posts');
        }
        else if(mode === Mode.LOGIN_DONE) {
            if (url === 'http://blog.home.blogbus.com/posts'){
                setMode(Mode.POST_HOMEPAGE);
                setTimeout(readPostList, 5000);
            }
        }
        // if (url.indexOf('vote/rankingList') > 0){
        //     const content = await resp.text();
        //     const ts = new Date();
        //     const insertQuery = `INSERT INTO ${TABLE_NAME}(detail,ts) VALUES('${content}', NOW())`;
        //     console.log(insertQuery)
        //     pgClient.query(insertQuery);
        // }
    });

    await page.goto('http://passport.blogbus.com/login_form');
    setMode(Mode.TO_LOGIN);

    setTimeout(async ()=>{
        
        await page.evaluate(() => {
            console.log(document.getElementsByName('username'))
            document.getElementsByName('username')[0].value = "多啦好多梦";
            document.getElementsByName('password')[0].value = "red1984526";
            document.querySelector('#loginFrame input[type="image"]').click();
        });
        // await page.screenshot({path: 'example.png'});
        // console.log('done');
    }, 5000);
    
    // await browser.close();
}

main();