const puppeteer = require('puppeteer');

const main = async () => {
    let loginDone = false;
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    page.on('response', async (resp)=>{
        const url = resp.url();
        if (!loginDone && url.indexOf('home.blogbus.com') > 0){
            loginDone = true;
            await page.goto('http://blog.home.blogbus.com/posts');
        }
        else if(loginDone) {
            if (url === 'http://blog.home.blogbus.com/posts'){
                console.log('blog list');
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


    setTimeout(async ()=>{
        console.log('1.login');
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