const start = new Date();
console.log('Getting started at: ' + start);
const https = require('https');
var buff = '';
console.log(`Wait about 15 seconds, please, because of large number of requestst to RANDOM.ORG.
One request allows us to GET 10K numbers. So we are waiting for 100 such requests!
Keep in mind, that you can run this script just once, then your qouta on RANDOM.ORG for today wiil be over.
So you can wait until midnight or change your IP :)`);
for (let i = 0; i < 100; i++) {
    https.get('https://www.random.org/integers/?num=10000&min=0&max=1&col=5&base=10&format=plain&rnd=new', (res) => {
        if (res.statusCode !== 200) {
            let error = new Error(`Request Failed.\nStatus Code: ${res.statusCode}`);
            console.log(error.message);
            return;
        }
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            for (let char of chunk) {
                if (char == '0' || char == '1') buff += char; 
            }
        });
        res.on('end', () => { 
            if (i == 99) {
                /*Function BIND used because we need to wait when all requests will be finished.
                In a good way it should be started when the last promise will be ready, but I dont know how to do it.
                Or we can use chains of promises but it's not as good as the previous version.*/
                setTimeout((function(){
                    analyze();
                }).bind(buff), 10000)
            }
        });
    }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
    });
}

function analyze() {
    let length = buff.length;
    console.log('Total number of numbers in buffer: ' + length);
    let a0 = buff.match(new RegExp('0', 'g')).length;
    let a1 = length - a0;
    console.log('----------FIRST PART----------');
    console.log(`Amount of '0': ${a0}, ${(a0/length*100).toFixed(3)} persent of all`);
    console.log(`Amount of '1': ${a1}, ${(a1/length*100).toFixed(3)} persent of all`);
    console.log('----------SECOND PART---------');
    let tmp, tmp2 = 0;
    for (let i = 0; i < 4; i++) {
        if (i < 2) { tmp = '0' + i.toString(2);
        } else {
            tmp = i.toString(2);
        }
        tmp = new RegExp(tmp, 'g')
        while (tmp.exec(buff)) {
            tmp.lastIndex--;
            tmp2++;
        }
        console.log(`Amount of '${tmp.source}': ${tmp2}, ${(tmp2/(length-1)*100).toFixed(3)} persent of all`);
        tmp2 = 0;
    }
    console.log('----------THIRD PART----------');
    let temp, temp2 = 0;
    for (let i = 0; i < 8; i++) {
        if (i < 2) {
            temp = '00' + i.toString(2);
        } else {
            if (i < 4) {
                temp = '0' + i.toString(2);
            } else {
                temp = i.toString(2);
            }
        } 
        temp = new RegExp(temp, 'g')
        while (temp.exec(buff)) {
            temp.lastIndex-=2;
            temp2++;
        }
        console.log(`Amount of '${temp.source}': ${temp2}, ${(temp2/(length-2)*100).toFixed(3)} persent of all`);
        temp2 = 0;
    }
    console.log('------------------------------');
    const finish = new Date();
    console.log(`Finished at: ${finish}\nTime spent: ${(finish - start)/1000} seconds (10 for waiting and ${((finish - start)/1000 - 10).toFixed(3)} for executing).`);
}