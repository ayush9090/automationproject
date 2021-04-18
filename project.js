let puppeteer = require("puppeteer");
let fs = require("fs");
let path=require("path");
let figlet=require("figlet");
let emnpass=require("./config")
let email1=process.argv[4];


let searchname=process.argv[2]+process.argv[3];
figlet(searchname, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});
(async function () {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        let newPage= await browserInstance.newPage();
        console.log("getting information...\n");
     await newPage.goto("https://www.google.com");
     await newPage.type("input.gLFyf.gsfi",searchname,{ delay: 200 });
     await newPage.click("input.gNO89b",{ delay: 200 });
     await newPage.waitForSelector(".MXl0lf.mtqGb.EhIML")
     await newPage.click(".MXl0lf.mtqGb.EhIML");
     await newPage.waitForSelector("div.dbg0pd")
     await newPage.waitForSelector(".rllt__details.lqhpac div");
     console.log("data collected.\n");
     let NameandAdress=await newPage.evaluate(consoleFn);
     console.log("generating pdf...\n");
     writeStream = fs.createWriteStream(path.resolve(searchname+'.pdf'));
     writeStream.write(NameandAdress);
     console.log("pdf generate successfully\n");
     //email
     console.log("sending mail...\n");
    await newPage.goto("https://login.yahoo.com/");
     await newPage.waitForSelector(".phone-no");
     await newPage.type(".phone-no",emnpass.username);
     await newPage.waitForSelector(".pure-button.puree-button-primary.challenge-button");
     await newPage.click(".pure-button.puree-button-primary.challenge-button");
     await newPage.waitForSelector(".password");
     await newPage.type(".password",emnpass.password);
     await newPage.click(".pure-button.puree-button-primary.puree-spinner-button.challenge-button");
     await newPage.waitForSelector("a#header-mail-button");
     await newPage.click("a#header-mail-button");
     await newPage.waitForSelector('a[aria-label="Compose"]');
     await newPage.click('a[aria-label="Compose"]');
     await newPage.waitForNavigation();
     await newPage.waitForSelector('input[id="message-to-field"]');
     await newPage.type('input[id="message-to-field"]',email1);
     await newPage.waitForSelector('input[data-test-id="compose-subject"]');
     await newPage.type('input[data-test-id="compose-subject"]',searchname);
     await newPage.waitForSelector(".rte.em_N.ir_0.iy_A.iz_h.N_6Fd5");
     await newPage.click(".rte.em_N.ir_0.iy_A.iz_h.N_6Fd5");
     await newPage.type(".rte.em_N.ir_0.iy_A.iz_h.N_6Fd5",NameandAdress);
     await newPage.waitForSelector('button[data-test-id="compose-send-button"]');
     await newPage.click('button[data-test-id="compose-send-button"]');
     console.log("mail send successfully.\n");
     await browserInstance.close();
    }
    catch(err)
    {
        console.log(err);
    }
    
})();
function consoleFn()
{
    
    let namearr=document.querySelectorAll("div.dbg0pd");
    let adrsarr=document.querySelectorAll(".rllt__details.lqhpac");
    let string="";
    for(let i=0;i<namearr.length;i++)
    {
        let name=namearr[i].innerText;
        let addrs=adrsarr[i].innerText;
        let number=i+1;
        
       let m="\n"+number+".     \n"+"name->"+name+"\n"+"adress->"+addrs;
       string+=m;
        
    }
    return string;
    
}
