const path = require('path');
const request = require('request-promise');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, '..', 'public');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const moment = require('moment');
const shortid = require('shortid');
const fs = require('fs');
moment.locale('th');
const admin = require('firebase-admin');
// const serviceAccount = require('./admin.json');
admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount)
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": "bot-orders",
        "private_key_id": process.env.ADMIN_PRIVATE_KEY_ID,
        "private_key": process.env.ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.CLIENT_EMAIL,
        "client_id": process.env.CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    })
});
var db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
db.settings(settings);
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_TH = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer H+Um79B9DkzqrE/LDPIMxAZ8thwdUe6rFGtzjBiVfx0jbOWh5vCVLgaOIW+BZ78ulZIfjKNk0gK3XH2tW3KpPJgpt77SdnVohNXWTFtVZiDIJBGmzmOjyybjOLCCOtqKbbH6CIyKv/Wdn+O3xW0BVwdB04t89/1O/w1cDnyilFU=`
};
const LINE_KH = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer QclnB8WLKaSU+oYsqIcJH/haCyu8zkC8ZVxt4dQjqMyA139YBK0Wm6E29P6Rk0xiyB12PDU5Ob2ifUmtnoFAfMeA6SUP9/cbiK9b/s3amShuBERvpDO0qWhs3UBH1HPIs4KPV0oZ0NtmG+KBBdtSTQdB04t89/1O/w1cDnyilFU=`
};
var jsonParser = bodyParser.json();
app.post('/api/linebot', jsonParser, (req, res) => {
    const request = req.body.events[0];
    const msg = request.message.text;
    const userId = request.source.userId;
    const adminRef = db.collection('admins').doc(userId);
    const ownerRef = db.collection('owners').doc(userId);
    let obj = {
        replyToken: request.replyToken,
        messages: []
    };
    // if (request.message.type !== 'text' || request.source.type !== 'group') {
    //}
    if (msg.indexOf('@@notice:') > -1 && msg.split(':').length >= 2) {
        db.collection('groups').get()
            .then(snapShot => {
                snapShot.forEach(group => {
                    push({
                        to: group.id,
                        messages: [
                            {
                                "type": "text",
                                "text": msg.substring(msg.indexOf(':') + 1)
                            }
                        ]
                    }, LINE_TH)
                })
            })
    } else if (msg.indexOf('@@admin:') > -1 && msg.split(':').length == 2) {
        adminRef.set({
            userId,
            name: msg.split(':')[1].replace(/\s/g, ''),
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            role: 'admin'
        })
            .then(admin => {
                obj.messages.push({
                    type: 'text',
                    text: `${emoji(0x10002D)}${emoji(0x10002D)} ลงทะเบียน ${msg.split(':')[1]} เป็น Admin เรียบร้อยค่ะ ${emoji(0x10002D)}${emoji(0x10002D)}`
                })
                reply(obj, LINE_TH);
            })
    } else if (msg.indexOf('@@owner:') > -1 && msg.split(':').length == 2) {
        adminRef.set({
            userId,
            name: msg.split(':')[1].replace(/\s/g, ''),
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            role: 'owner'
        })
            .then(owner => {

                obj.messages.push({
                    type: 'text',
                    text: `${emoji(0x100058)}${emoji(0x100058)} ลงทะเบียน ${msg.split(':')[1]} เป็น Owner เรียบร้อยค่ะ ${emoji(0x100058)}${emoji(0x100058)}`
                })
                reply(obj, LINE_TH);
            })
    } else if (msg.indexOf('@@format') > -1) {
        obj.messages.push({
            type: 'text',
            text: `#n:ชื่อผู้รับสินค้า\n#t:เบอร์โทรศัพท์\n#a:ที่อยู่\n#o:รายการสินค้า\n#b:ชื่อธนาคารหรือCOD\n#d:ค่าขนส่ง\n#f:Facebookลูกค้า\n#z:ชื่อเพจหรือLine@`
        })
        reply(obj, LINE_TH);
    } else if (msg.indexOf('@@product') > -1) {
        db.collection('products').get()
            .then(snapShot => {
                let pt = `${emoji(0x10005C)}รายการสินค้า${emoji(0x100060)}\n`;
                snapShot.forEach(product => {
                    pt += `${product.id}:${product.data().name} เหลือ ${formatMoney(product.data().amount, 0)} ${product.data().unit}\n`;
                })
                const l = Math.ceil(pt.length / 2000) * 2000;
                for (var i = 0; i < l; i += 2000) {
                    obj.messages.push({
                        type: 'text',
                        text: pt.substr(i, 2000)
                    })
                }
                // obj.messages.push({
                //     type: 'text',
                //     text: pt
                // })
                reply(obj, LINE_TH);
            })

    } else if (msg.indexOf('@@ems:') > -1 && msg.split(':').length >= 2) {
        const id = msg.split(':')[1].replace(/\s/g, '');
        db.collection('orders').doc(id).get()
            .then(doc => {
                if (doc.exists) {
                    const order = doc.data();
                    const link = (order.expressName == 'KERRY' ? order.expressLink + '=' + order.tracking :
                        (order.expressName == 'EMS' ? 'http://emsbot.com/#/?s=' + order.tracking : order.expressLink))
                    const track = order.tracking == '' ? (order.cutoff ? 'กำลังนำเลขพัสดุเข้าสู่ระบบ' : 'กำลังจัดเตรียมสินค้า') : order.tracking;
                    obj.messages.push({
                        type: 'text',
                        text: `รหัสสั่งซื้อ: ${id}\nชื่อ: ${order.name}\nเบอร์โทร: ${order.tel}\nวันที่ส่งสินค้า:${moment(order.cutoffDate).format('ll')}\nเลขพัสดุ: ${track}${link ? `\nตรวจสอบได้ที่ลิ้งนี้ค่ะ: ${link}` : ''}`
                    })
                } else {
                    obj.messages.push({
                        type: 'text',
                        text: `(ตรวจเลขพัสดุ) ไม่มีรหัสสั่งซื้อนี้จ้า ${id}`
                    })
                }
                reply(obj, LINE_TH);
            })

    } else if (msg.indexOf('@@zip+:') > -1 && msg.split(':').length == 2) {
        const fs = require('fs');
        const rawdata = fs.readFileSync('./server/postcode.json');
        let postcodes = JSON.parse(rawdata);
        const newcode = Number(msg.split(':')[1].replace(/\D/g, ''));
        if (!isNaN(newcode) && newcode.toString().length == 5) {
            postcodes.push(newcode);
            const data = [...new Set(postcodes)];
            fs.writeFile('./server/postcode.json', JSON.stringify(data), function (err) {
                obj.messages.push({
                    type: 'text',
                    text: `รหัสไปรษณีย์ ${newcode} ถูกเพิ่มแล้ว!`
                })
                reply(obj, LINE_TH);
            });
        } else {
            obj.messages.push({
                type: 'text',
                text: `รหัสไปรษณีย์ไม่ถูกต้องจ้า`
            })
            reply(obj, LINE_TH);
        }
    } else if (msg.indexOf('@@zip-:') > -1 && msg.split(':').length == 2) {
        const fs = require('fs');
        const rawdata = fs.readFileSync('./server/postcode.json');
        const postcodes = JSON.parse(rawdata);
        const newcode = Number(msg.split(':')[1].replace(/\D/g, ''));
        if (!isNaN(newcode) && newcode.toString().length == 5) {
            const data = postcodes.filter(f => f != newcode);
            fs.writeFile('./server/postcode.json', JSON.stringify(data), function (err) {
                obj.messages.push({
                    type: 'text',
                    text: `รหัสไปรษณีย์ ${newcode} ถูกลบแล้ว!`
                })
                reply(obj, LINE_TH);
            });
        } else {
            obj.messages.push({
                type: 'text',
                text: `รหัสไปรษณีย์ไม่ถูกต้องจ้า`
            })
            reply(obj, LINE_TH);
        }
    } else {
        adminRef.get()
            .then(user => {
                if (user.exists) {
                    if (request.source.type == 'group' && user.data().active == true) {
                        const groupId = request.source.groupId;
                        if (msg.indexOf('@@ยกเลิก:') > -1 && msg.split(':').length == 2) {
                            const orderId = msg.split(':')[1].replace(/\s/g, '');;
                            const orderRef = db.collection('orders').doc(orderId);
                            orderRef.get()
                                .then(order => {
                                    if (order.exists) {
                                        if (order.data().cutoff && user.data().role == 'admin') {
                                            obj.messages.push({
                                                type: 'text',
                                                text: `${emoji(0x100035)}ไม่สามารถยกเลิกรายการสั่งซื้อ ${orderId}\nเนื่องจากได้ทำการตัดรอบไปแล้วค่ะ${emoji(0x1000AE)}`
                                            })
                                            reply(obj, LINE_TH);
                                        } else {
                                            async function callback() {
                                                for (var p = 0; p < order.data().product.length; p++) {
                                                    await db.collection('products').doc(order.data().product[p].code).get()
                                                        .then(product => {
                                                            const balance = product.data().amount + order.data().product[p].amount;
                                                            db.collection('products').doc(order.data().product[p].code)
                                                                .set({ amount: balance }, { merge: true })
                                                        })
                                                }
                                                await orderRef.delete()
                                                    .then(cancel => {
                                                        obj.messages.push({
                                                            type: 'text',
                                                            text: `${emoji(0x100035)}ยกเลิกรายการสั่งซื้อ ${orderId} เรียบร้อยค่ะ${emoji(0x100018)}`//${formatOrder(order.data())}`
                                                        })
                                                        reply(obj, LINE_TH);
                                                    })
                                            }
                                            callback();

                                        }
                                    } else {
                                        obj.messages.push({
                                            type: 'text',
                                            text: `${emoji(0x100035)}ไม่มีรายการสั่งซื้อนี้: ${orderId}\nกรุณาตรวจสอบ "รหัสสั่งซื้อ" ค่ะ${emoji(0x10000F)}`
                                        })
                                    }
                                    reply(obj, LINE_TH);
                                })
                        } else if (msg.indexOf('@@return:') > -1 && msg.split(':').length == 2) {
                            const orderId = msg.split(':')[1].replace(/\s/g, '');;
                            const orderRef = db.collection('orders').doc(orderId);
                            orderRef.get()
                                .then(order => {
                                    if (order.exists) {
                                        if (user.data().role == 'owner') {
                                            async function callback() {
                                                for (var p = 0; p < order.data().product.length; p++) {
                                                    await db.collection('products').doc(order.data().product[p].code).get()
                                                        .then(product => {
                                                            const balance = product.data().amount + order.data().product[p].amount;
                                                            db.collection('products').doc(order.data().product[p].code)
                                                                .update({ amount: balance })
                                                        })
                                                }
                                                await orderRef.update({ return: true })
                                                    .then(cancel => {
                                                        obj.messages.push({
                                                            type: 'text',
                                                            text: `${emoji(0x10001C)}ตีคืนรายการสั่งซื้อ ${orderId} เรียบร้อยค่ะ${emoji(0x100018)}`//${formatOrder(order.data())}`
                                                        })
                                                        reply(obj, LINE_TH);
                                                    })
                                            }
                                            callback();
                                        }
                                    } else {
                                        obj.messages.push({
                                            type: 'text',
                                            text: `${emoji(0x100035)}ไม่มีรายการสั่งซื้อนี้: ${orderId}\nกรุณาตรวจสอบ "รหัสสั่งซื้อ" ค่ะ${emoji(0x10000F)}`
                                        })
                                    }
                                    reply(obj, LINE_TH);
                                })
                        } else if (msg.indexOf('@@resend:') > -1 && msg.split(':').length == 2) {
                            const orderId = msg.split(':')[1].replace(/\s/g, '');;
                            const orderRef = db.collection('orders').doc(orderId);
                            orderRef.get()
                                .then(order => {
                                    if (order.exists) {
                                        if (user.data().role == 'owner') {
                                            async function callback() {
                                                for (var p = 0; p < order.data().product.length; p++) {
                                                    await db.collection('products').doc(order.data().product[p].code).get()
                                                        .then(product => {
                                                            const balance = product.data().amount - order.data().product[p].amount;
                                                            db.collection('products').doc(order.data().product[p].code)
                                                                .update({ amount: balance })
                                                        })
                                                }
                                                await orderRef.update({ return: false })
                                                    .then(cancel => {
                                                        obj.messages.push({
                                                            type: 'text',
                                                            text: `${emoji(0x100061)}ส่งใหม่รายการสั่งซื้อ ${orderId} เรียบร้อยค่ะ${emoji(0x100018)}`//${formatOrder(order.data())}`
                                                        })
                                                        reply(obj, LINE_TH);
                                                    })
                                            }
                                            callback();
                                        }
                                    } else {
                                        obj.messages.push({
                                            type: 'text',
                                            text: `${emoji(0x100035)}ไม่มีรายการสั่งซื้อนี้: ${orderId}\nกรุณาตรวจสอบ "รหัสสั่งซื้อ" ค่ะ${emoji(0x10000F)}`
                                        })
                                    }
                                    reply(obj, LINE_TH);
                                })
                        } else if (msg.indexOf('#') > -1) {
                            initMsgOrder(msg)
                                .then(resultOrder => {
                                    if (resultOrder.success) {
                                        db.collection('counter').doc('orders').get()
                                            .then(counts => {
                                                const countsData = counts.data();
                                                let no = 1;
                                                let cutoff = countsData.cutoff;
                                                let orderId = yyyymmdd() + '-' + shortid.generate();
                                                // let orderId = yyyymmdd() + '-' + fourDigit(no);
                                                let orderDate = yyyymmdd();

                                                let cutoffDate = countsData.cutoffDate;
                                                let cutoffOk = true;
                                                if (resultOrder.data.id && user.data().role == 'owner') { //edit with id
                                                    orderId = resultOrder.data.id;
                                                    orderDate = resultOrder.data.id.split('-')[0];
                                                    cutoff = true;
                                                    if (resultOrder.data.cutoffDate) {
                                                        if (resultOrder.data.cutoffDate.length == 8)
                                                            cutoffDate = resultOrder.data.cutoffDate;
                                                        else
                                                            cutoffOk = false;
                                                    } else {
                                                        cutoffOk = false;
                                                    }
                                                } else {
                                                    if (countsData.date == yyyymmdd()) {
                                                        no = countsData.no + 1;
                                                        cutoff = false;
                                                        db.collection('counter').doc('orders').update({ no })
                                                    } else {
                                                        if (cutoff == true) {
                                                            cutoff = false;
                                                        }
                                                        db.collection('counter').doc('orders').update({ date: orderDate, no, cutoff })
                                                    }
                                                }
                                                if (cutoffOk == true) {
                                                    db.collection('orders').doc(orderId).get()
                                                        .then(doc => {
                                                            if (doc.exists) {
                                                                obj.messages.push({ type: `text`, text: `${emoji(0x100026)}กรุณาทำการสั่งซื้อใหม่อีกรอบ!\nเนื่องจากมีแอดมินท่านอื่นสั่งเวลาเดียวกับคุณ` })
                                                                reply(obj, LINE_TH);
                                                            } else {
                                                                db.collection('orders').doc(orderId)
                                                                    .set(Object.assign({
                                                                        userId, groupId,
                                                                        admin: user.data().name,
                                                                        cutoffDate,
                                                                        cutoff,
                                                                        tracking: '',
                                                                        timestamp: admin.firestore.FieldValue.serverTimestamp(),
                                                                        orderDate,
                                                                        orderNo: no,
                                                                        country: 'TH',
                                                                        return: false
                                                                    }, resultOrder.data))
                                                                    .then(order => {
                                                                        db.collection('groups').doc(groupId).set({})
                                                                        async function callback() {
                                                                            for (var p = 0; p < resultOrder.data.product.length; p++) {
                                                                                await db.collection('products').doc(resultOrder.data.product[p].code).get()
                                                                                    .then(product => {
                                                                                        const balance = product.data().amount - resultOrder.data.product[p].amount;
                                                                                        if (balance <= product.data().alert) {
                                                                                            db.collection('admins').get()
                                                                                                .then(snapShot => {
                                                                                                    snapShot.forEach(admin => {
                                                                                                        push({
                                                                                                            to: admin.id,
                                                                                                            messages: [
                                                                                                                {
                                                                                                                    "type": "text",
                                                                                                                    "text": `สินค้า ${product.id}\n${product.data().name}\nเหลือแค่ ${balance} ชิ้นละจ้า`
                                                                                                                }
                                                                                                            ]
                                                                                                        }, LINE_TH)
                                                                                                    })
                                                                                                })
                                                                                        }
                                                                                        db.collection('products').doc(resultOrder.data.product[p].code)
                                                                                            .set({ amount: balance }, { merge: true })
                                                                                    })
                                                                            }

                                                                            await obj.messages.push({
                                                                                type: 'text',
                                                                                text: `รหัสสั่งซื้อ: ${orderId}\n${resultOrder.text}\n\n⛔️โปรดอ่านทุกบรรทัด⛔️\n👉กรุณาตรวจสอบข้อมูลรายการสั่งซื้อด้านบนให้ครบถ้วน ถ้าหากพบว่าไม่ถูกต้องกรุณาแจ้งแอดมินให้แก้ไขทันที\n👉หากไม่มีการทักท้วงจากลูกค้า หรือมีการจัดส่งสินค้าเรียบร้อยแล้ว ทางร้านจะถือว่าลูกค้ายืนยันข้อมูลรายการสั่งซื้อดังกล่าว และทางร้านจะไม่รับผิดชอบกรณีใดๆ ทั้งสิ้น\n🙏ขอบคุณนะคะที่อุดหนุนสินค้า😊`
                                                                            })
                                                                            await obj.messages.push({
                                                                                type: 'text',
                                                                                text: `@@ยกเลิก:${orderId}`
                                                                            })
                                                                            await reply(obj, LINE_TH);
                                                                        }
                                                                        callback();
                                                                    })
                                                            }
                                                        })
                                                } else {
                                                    obj.messages.push({ type: `text`, text: 'แก้ไขรหัสสั่งซื้อ: ' + resultOrder.data.id + ' ไม่สำเร็จ!\nเนื่องจากข้อมูลวันตัดรอบไม่ถูกต้อง' })
                                                    reply(obj, LINE_TH);
                                                }

                                            })

                                    } else {
                                        obj.messages.push({ type: `text`, text: `${emoji(0x100026)}รายการสั่งซื้อไม่ถูกต้องกรุณาตรวจสอบค่ะ!!\n${resultOrder.text}` })
                                        reply(obj, LINE_TH);
                                    }
                                })

                        }
                    } else {
                        obj.messages.push({
                            type: 'text',
                            text: `คุณไม่มีสิทธิ์ใช้บอท หรือบอทปิดไม่ให้ใช้งานตอนนี้ค่ะ`
                        })
                        reply(obj, LINE_TH);
                    }
                } else {
                    return;
                }
            })
    }
})
app.post('/api/bot/kh', jsonParser, (req, res) => {
    const request = req.body.events[0];
    const msg = request.message.text;
    const userId = request.source.userId;
    const adminRef = db.collection('admins').doc(userId);

    let obj = {
        replyToken: request.replyToken,
        messages: []
    };
    // if (request.message.type !== 'text' || request.source.type !== 'group') {
    //}
    if (msg.indexOf('@@notice:') > -1 && msg.split(':').length >= 2) {
        db.collection('groups').get()
            .then(snapShot => {
                snapShot.forEach(group => {
                    push({
                        to: group.id,
                        messages: [
                            {
                                "type": "text",
                                "text": msg.substring(msg.indexOf(':') + 1)
                            }
                        ]
                    }, LINE_KH)
                })
            })
    } else if (msg.indexOf('@@admin:') > -1 && msg.split(':').length == 2) {
        adminRef.set({
            userId,
            name: msg.split(':')[1].replace(/\s/g, ''),
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            active: false,
            role: 'admin'
        })
            .then(admin => {
                obj.messages.push({
                    type: 'text',
                    text: `${emoji(0x10002D)}${emoji(0x10002D)} ลงทะเบียน ${msg.split(':')[1]} เป็น Admin เรียบร้อยค่ะ ${emoji(0x10002D)}${emoji(0x10002D)}`
                })
                reply(obj, LINE_KH);
            })
    } else if (msg.indexOf('@@owner:') > -1 && msg.split(':').length == 2) {
        adminRef.set({
            userId,
            name: msg.split(':')[1].replace(/\s/g, ''),
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            active: false,
            role: 'owner'
        })
            .then(owner => {

                obj.messages.push({
                    type: 'text',
                    text: `${emoji(0x100058)}${emoji(0x100058)} ลงทะเบียน ${msg.split(':')[1]} เป็น Owner เรียบร้อยค่ะ ${emoji(0x100058)}${emoji(0x100058)}`
                })
                reply(obj, LINE_KH);
            })
    } else if (msg.indexOf('@@format') > -1) {
        obj.messages.push({
            type: 'text',
            text: `#f:ชื่อเฟสลูกค้า\n#t:เบอร์โทรศัพท์\n#a:ที่อยู่\n#o:รายการสินค้า\n#b:ชื่อธนาคารหรือCOD\n#d:ค่าขนส่ง\n#z:ชื่อเพจหรือLine@`
        })
        reply(obj, LINE_KH);
    } else if (msg.indexOf('@@product') > -1) {
        db.collection('products').get()
            .then(snapShot => {
                let pt = `${emoji(0x10005C)}รายการสินค้า${emoji(0x100060)}\n`;
                snapShot.forEach(product => {
                    if (product.id.substr(0, 3) == 'KH-')
                        pt += `${product.id} เหลือ ${formatMoney(product.data().amount, 0)} ${product.data().unit}\n`;
                })
                obj.messages.push({
                    type: 'text',
                    text: pt
                })
                reply(obj, LINE_KH);
            })

    } else if (msg.indexOf('@@ems:') > -1 && msg.split(':').length >= 2) {
        const id = msg.split(':')[1].replace(/\s/g, '');
        db.collection('orders').doc(id).get()
            .then(doc => {
                if (doc.exists) {
                    const order = doc.data();
                    const link = (order.expressName == 'KERRY' ? order.expressLink + '=' + order.tracking :
                        (order.expressName == 'EMS' ? 'http://emsbot.com/#/?s=' + order.tracking : order.expressLink))
                    const track = order.tracking == '' ? (order.cutoff ? 'กำลังนำเลขพัสดุเข้าสู่ระบบ' : 'กำลังจัดเตรียมสินค้า') : order.tracking;
                    obj.messages.push({
                        type: 'text',
                        text: `รหัสสั่งซื้อ: ${id}\nชื่อ: ${order.name}\nเบอร์โทร: ${order.tel}\nวันที่ส่งสินค้า:${moment(order.cutoffDate).format('ll')}\nเลขพัสดุ: ${track}${link ? `\nตรวจสอบได้ที่ลิ้งนี้ค่ะ: ${link}` : ''}`
                    })
                } else {
                    obj.messages.push({
                        type: 'text',
                        text: `(ตรวจเลขพัสดุ) ไม่มีรหัสสั่งซื้อนี้จ้า ${id}`
                    })
                }
                reply(obj, LINE_KH);
            })

    } else {
        adminRef.get()
            .then(user => {
                if (user.exists) {
                    if (request.source.type == 'group' && user.data().active == true) {
                        const groupId = request.source.groupId;
                        if (msg.indexOf('@@ยกเลิก:') > -1 && msg.split(':').length == 2) {
                            const orderId = msg.split(':')[1];
                            const orderRef = db.collection('orders').doc(orderId);
                            orderRef.get()
                                .then(order => {
                                    if (order.exists) {
                                        // if (order.data().cutoff && user.data().role == 'admin') {
                                        //     obj.messages.push({
                                        //         type: 'text',
                                        //         text: `${emoji(0x100035)}ไม่สามารถยกเลิกรายการสั่งซื้อ ${orderId}\nเนื่องจากได้ทำการตัดรอบไปแล้วค่ะ${emoji(0x1000AE)}`
                                        //     })
                                        //     reply(obj, LINE_KH);
                                        // } else {
                                        async function callback() {
                                            for (var p = 0; p < order.data().product.length; p++) {
                                                await db.collection('products').doc(order.data().product[p].code).get()
                                                    .then(product => {
                                                        const balance = product.data().amount + order.data().product[p].amount;
                                                        db.collection('products').doc(order.data().product[p].code)
                                                            .set({ amount: balance }, { merge: true })
                                                    })
                                            }
                                            await orderRef.delete()
                                                .then(cancel => {
                                                    obj.messages.push({
                                                        type: 'text',
                                                        text: `${emoji(0x100035)}ยกเลิกรายการสั่งซื้อ ${orderId} เรียบร้อยค่ะ${emoji(0x100018)}`//${formatOrder(order.data())}`
                                                    })
                                                    reply(obj, LINE_KH);
                                                })
                                        }
                                        callback();

                                        // }
                                    } else {
                                        obj.messages.push({
                                            type: 'text',
                                            text: `${emoji(0x100035)}ไม่มีรายการสั่งซื้อนี้: ${orderId}\nกรุณาตรวจสอบ "รหัสสั่งซื้อ" ค่ะ${emoji(0x10000F)}`
                                        })
                                    }
                                    reply(obj, LINE_KH);
                                })
                        } else if (msg.indexOf('#') > -1) {
                            initMsgOrderKH(msg)
                                .then(resultOrder => {
                                    if (resultOrder.success) {
                                        db.collection('counter').doc('orders').get()
                                            .then(counts => {
                                                const countsData = counts.data();
                                                let no = 1;
                                                let cutoff = countsData.cutoff;
                                                let orderId = yyyymmdd() + '-' + shortid.generate();
                                                // let orderId = yyyymmdd() + '-' + fourDigit(no);
                                                let orderDate = yyyymmdd();

                                                let cutoffDate = countsData.cutoffDate;
                                                let cutoffOk = true;
                                                if (resultOrder.data.id && user.data().role == 'owner') { //edit with id
                                                    orderId = resultOrder.data.id;
                                                    orderDate = resultOrder.data.id.split('-')[0];
                                                    cutoff = true;
                                                    if (resultOrder.data.cutoffDate) {
                                                        if (resultOrder.data.cutoffDate.length == 8)
                                                            cutoffDate = resultOrder.data.cutoffDate;
                                                        else
                                                            cutoffOk = false;
                                                    } else {
                                                        cutoffOk = false;
                                                    }
                                                } else {
                                                    if (countsData.date == yyyymmdd()) {
                                                        no = countsData.no + 1;
                                                        cutoff = false;
                                                        db.collection('counter').doc('orders').update({ no })
                                                    } else {
                                                        if (cutoff == true) {
                                                            cutoff = false;
                                                        }
                                                        db.collection('counter').doc('orders').update({ date: yyyymmdd(), no, cutoff })
                                                    }
                                                }
                                                if (cutoffOk == true) {
                                                    db.collection('orders').doc(orderId).get()
                                                        .then(doc => {
                                                            if (doc.exists) {
                                                                obj.messages.push({ type: `text`, text: `${emoji(0x100026)}กรุณาทำการสั่งซื้อใหม่อีกรอบ!\nเนื่องจากมีแอดมินท่านอื่นสั่งเวลาเดียวกับคุณ` })
                                                                reply(obj, LINE_KH);
                                                            } else {
                                                                db.collection('orders').doc(orderId)
                                                                    .set(Object.assign({
                                                                        userId, groupId,
                                                                        name: resultOrder.data.fb,
                                                                        admin: user.data().name,
                                                                        cutoffDate: orderDate,
                                                                        cutoff: true,
                                                                        tracking: 'CAMBODIA',
                                                                        timestamp: admin.firestore.FieldValue.serverTimestamp(),
                                                                        orderDate,
                                                                        orderNo: no,
                                                                        country: 'KH',
                                                                        return: false
                                                                    }, resultOrder.data))
                                                                    .then(order => {
                                                                        // db.collection('groups').doc(groupId).set({})
                                                                        async function callback() {
                                                                            for (var p = 0; p < resultOrder.data.product.length; p++) {
                                                                                await db.collection('products').doc(resultOrder.data.product[p].code).get()
                                                                                    .then(product => {
                                                                                        const balance = product.data().amount - resultOrder.data.product[p].amount;
                                                                                        if (balance <= product.data().alert) {
                                                                                            db.collection('admins').get()
                                                                                                .then(snapShot => {
                                                                                                    snapShot.forEach(admin => {
                                                                                                        push({
                                                                                                            to: admin.id,
                                                                                                            messages: [
                                                                                                                {
                                                                                                                    "type": "text",
                                                                                                                    "text": `สินค้า ${product.id}\n${product.data().name}\nเหลือแค่ ${balance} ชิ้นละจ้า`
                                                                                                                }
                                                                                                            ]
                                                                                                        }, LINE_KH)
                                                                                                    })
                                                                                                })
                                                                                        }
                                                                                        db.collection('products').doc(resultOrder.data.product[p].code)
                                                                                            .set({ amount: balance }, { merge: true })
                                                                                    })
                                                                            }
                                                                            await obj.messages.push({
                                                                                type: 'text',
                                                                                text: `លេខកូដ: ${orderId}\n${resultOrder.text}\n\n⛔️សូមអានបន្ទាត់នីមួយៗ⛔️\n👉សូមពិនិត្យមើលតារាងបញ្ជាទិញទាំងមូលខាងលើ។ ប្រសិនបើរកឃើញថាមិនត្រឹមត្រូវសូមជូនដំណឹងដល់អ្នកគ្រប់គ្រងភ្លាមៗ។\n👉ប្រសិនបេីមិនមានការតាមពីអតិថិជន ឬបានប្រគល់ផលិតផលរួចទៅហើយ ហាងយេីងនឹងសន្មតថាអតិថិជនយល់ព្រមនឹងបញ្ជាកម្ម៉ង។ ហើយហាងនេះនឹងមិនទទួលខុសត្រូវចំពោះករណីណាមួយទេ\n🙏សូមអរគុណចំពោះការគាំទ្រផលិតផលរបស់យេីងខ្ញុំ​😊`
                                                                            })
                                                                            await obj.messages.push({
                                                                                type: 'text',
                                                                                text: `@@ยกเลิก:${orderId}`
                                                                            })
                                                                            await reply(obj, LINE_KH);
                                                                        }
                                                                        callback();
                                                                    })
                                                            }
                                                        })
                                                } else {
                                                    obj.messages.push({ type: `text`, text: 'แก้ไขรหัสสั่งซื้อ: ' + resultOrder.data.id + ' ไม่สำเร็จ!\nเนื่องจากข้อมูลวันตัดรอบไม่ถูกต้อง' })
                                                    reply(obj, LINE_KH);
                                                }

                                            })

                                    } else {
                                        obj.messages.push({ type: `text`, text: `${emoji(0x100026)}รายการสั่งซื้อไม่ถูกต้องกรุณาตรวจสอบค่ะ!!\n${resultOrder.text}` })
                                        reply(obj, LINE_KH);
                                    }
                                })

                        }
                    } else {
                        obj.messages.push({
                            type: 'text',
                            text: `คุณไม่มีสิทธิ์ใช้บอท หรือบอทปิดไม่ให้ใช้งานตอนนี้ค่ะ`
                        })
                        reply(obj, LINE_KH);
                    }
                } else {
                    return;
                }
            })
    }
})

app.post('/api/boardcast', jsonParser, (req, res) => {
    const boardcasts = req.body.boardcasts;
    for (var bc = 0; bc < boardcasts.length; bc++) {
        push(boardcasts[bc], LINE_TH);
    }
    return;
})

app.post('/api/notice', jsonParser, (req, res) => {
    db.collection('groups').get()
        .then(snapShot => {
            snapShot.forEach(group => {
                push({
                    to: group.id,
                    messages: [
                        {
                            "type": "text",
                            "text": req.body.notice
                        }
                    ]
                }, LINE_TH)
            })
        })
})
app.post('/api/auth/disabled', jsonParser, (req, res) => {
    admin.auth().updateUser(req.body.uid, {
        disabled: req.body.disabled
    }).then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        // console.log("Successfully updated user", userRecord.toJSON());
        res.json(userRecord.toJSON())
    }).catch(function (error) {
        // console.log("Error updating user:", error);
    });
})
app.post('/api/auth/create', jsonParser, (req, res) => {
    admin.auth().createUser({
        ...req.body
    }).then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        // console.log("Successfully updated user", userRecord.toJSON());
        res.json(userRecord.toJSON())
    }).catch(function (error) {
        // console.log("Error updating user:", error);
    });
})
app.use(express.static(publicPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'))
});
app.listen(port, () => {
    console.log('Server is up!')
});

const reply = (obj, LINE_HEADER) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/reply`,
        headers: LINE_HEADER,
        body: JSON.stringify({
            replyToken: obj.replyToken,
            messages: obj.messages
        })
    });
};
const push = (obj, LINE_HEADER) => {
    return request({
        method: `POST`,
        uri: `${LINE_MESSAGING_API}/push`,
        headers: LINE_HEADER,
        body: JSON.stringify(obj)
    });
};
const initMsgOrder = (txt) => {
    const express = ["K", 'F'];
    // const pages = ["@DB", "@SCR01", "@TCT01", "@TD01", "@TD02", "@TS01", "@TS02", "@TS03", "@TST", "DB", "SCR01", "SSN01", "TCT01", "TD01", "TD02", "TS01", "TS02", "TS03", "TST", "TPF01"];
    return db.collection('pages')
        .where('country', '==', 'TH')
        .get()
        .then(snapShotPages => {
            let pages = [];
            snapShotPages.forEach(page => {
                pages.push(page.id)
                pages.push('@' + page.id)
            })
            let orders = [];
            let data = Object.assign(...txt.split('#').filter(f => f != "")
                .map(m => {
                    if (m.split(':').length == 2) {
                        const dontReplces = ["name", "fb", "addr"];
                        let key = m.split(':')[0].toLowerCase().replace(/\s/g, '');;
                        switch (key) {
                            case 'n': key = 'name'; break;
                            case 't': key = 'tel'; break;
                            case 'a': key = 'addr'; break;
                            case 'o': key = 'product'; break;
                            // case 'b': key = 'bank'; break;
                            case 'b': key = 'banks'; break;
                            // case 'p': key = 'price'; break;
                            case 'e': key = 'edit'; break;
                            case 'f': key = 'fb'; break;
                            case 'l': key = 'fb'; break;
                            case 'z': key = 'page'; break;
                            case 'd': key = 'delivery'; break;
                            case 'cutoffdate': key = 'cutoffDate'; break;
                            case 'c': key = 'channel'; break;
                            default: key;
                        }
                        let value = m.split(':')[1];
                        if (!dontReplces.includes(key)) value = value.replace(/\s/g, '');
                        if (key !== 'addr' && key !== 'fb' && key !== 'id') value = value.replace(/\n/g, '').toUpperCase();

                        if (key !== 'price' && key !== 'delivery') {
                            value = value.trim();
                            if (key == 'product') {
                                const str = value;
                                // let orders = [];
                                let arr = str.split(',');
                                for (var a in arr) {
                                    if (arr[a].split('=').length == 2) {
                                        const code = arr[a].split('=')[0].toUpperCase();
                                        const amount = Number(arr[a].split('=')[1].replace(/\D/g, ''));
                                        const orderIndex = orders.findIndex(f => f.code == code);
                                        if (orderIndex > -1 && amount > 0) {
                                            orders[orderIndex]['amount'] = orders[orderIndex]['amount'] + amount
                                        } else {
                                            orders.push({
                                                code,
                                                amount,
                                                name: ''
                                            })
                                        }
                                    } else {
                                        const orderIndex = orders.findIndex(f => f.code == 'รหัสสินค้า');
                                        if (orderIndex > -1) {

                                        } else {
                                            orders.push({
                                                code: `${emoji(0x1000A6)}รหัสสินค้าไม่ถูกต้อง`,
                                                amount: 'undefined'
                                            })
                                        }
                                    }
                                }
                                value = orders;
                            } else if (key == 'page') {
                                if (pages.indexOf(value) == -1) {
                                    value = `${emoji(0x1000A6)}undefined`;
                                }
                            } else if (key == 'name') {
                                const deliver = value.substr(0, 1).toUpperCase();
                                if (express.indexOf(deliver) == -1) {
                                    value = `${emoji(0x1000A6)}undefined`;
                                }
                            } else if (key == 'bank') {
                                if (value.match(/[a-zA-Z]+/g, '') == null) {
                                    value = `${emoji(0x1000A6)}undefined`;
                                }
                                if (value.match(/\d{2}\.\d{2}/g) == null && ['COD', 'CM', 'XX', 'CP'].indexOf(value) == -1) {
                                    value = `${emoji(0x1000A6)}undefined`;
                                }
                            } else if (key == 'banks') {

                                const str = value;
                                let arr = str.split(',');
                                let banks = [];
                                for (var a in arr) {
                                    if (arr[a].split('=').length == 2) {
                                        const bank1 = arr[a].split('=')[0].toUpperCase();
                                        let price = Number(arr[a].split('=')[1].replace(/\D/g, ''));
                                        let name = '';
                                        let time = '00.00';
                                        let date = '000000';
                                        if (bank1.match(/[a-zA-Z]+/g, '') == null) {
                                            name = `${emoji(0x1000A6)}ธนาคารundefined`;
                                            time = 'undefined';
                                        }
                                        if (bank1.match(/\d{6}/g) == null && ['COD', 'CM', 'XX', 'CP'].indexOf(bank1) == -1) {
                                            name = bank1.match(/[a-zA-Z]+/g, '')[0];
                                            date = `${emoji(0x1000A6)}วันที่โอนundefined`;
                                            price = 'undefined';
                                        }
                                        if (bank1.match(/\d{2}\.\d{2}/g) == null && ['COD', 'CM', 'XX', 'CP'].indexOf(bank1) == -1) {
                                            name = bank1.match(/[a-zA-Z]+/g, '')[0];
                                            time = `${emoji(0x1000A6)}เวลาโอนundefined`;
                                            price = 'undefined';
                                        }
                                        if (price != 'undefined') {
                                            name = bank1.match(/[a-zA-Z]+/g, '')[0];
                                            date = ['COD', 'CM', 'XX', 'CP'].indexOf(bank1) == -1 ?
                                                moment(bank1.match(/\d{6}/g)[0], 'DDMMYY').isValid() ?
                                                    moment(bank1.match(/\d{6}/g)[0], 'DDMMYY').format('YYYYMMDD') : `${emoji(0x1000A6)}วันที่โอนundefined`
                                                : date;
                                            time = ['COD', 'CM', 'XX', 'CP'].indexOf(bank1) == -1 ? bank1.match(/\d{2}\.\d{2}/g)[0] : time;
                                        }
                                        banks.push({
                                            name,
                                            date,
                                            time,
                                            price
                                        })
                                    } else {
                                        banks.push({
                                            name: arr[a].toUpperCase(),
                                            price: `${emoji(0x1000A6)}ยอดเงินundefined`
                                        })
                                    }
                                }
                                value = banks
                            } else if (key == 'edit') {
                                if (value == 'Y') {
                                    value = true;
                                } else if (value == 'N') {
                                    value = false
                                } else {
                                    value = `${emoji(0x1000A6)}แก้ไขต้องเป็น Y หรือ N เท่านั้นจ้าundefined`
                                }
                            } else if (key == 'addr') {
                                value = value.replace(/\n/g, ' ');
                                const postcode = value.match(/[0-9]{5}/g);
                                if (postcode == null) {
                                    value = `${value + ' ' + emoji(0x1000A6)}ไม่มีรหัสไปรษณีย์undefined`
                                } else {
                                    const rawdata = fs.readFileSync('./server/postcode.json');
                                    // const postcodes = require('./postcode.json');
                                    const postcodes = JSON.parse(rawdata)
                                    if (postcodes.indexOf(Number(postcode[postcode.length - 1])) == -1) {
                                        value = `${value + ' ' + emoji(0x1000A6)}รหัสไปรษณีย์ไม่ถูกต้องundefined`
                                    }
                                }
                            } else if (key == 'tel') {
                                value = value.replace(/\D/g, ''); //เหลือแต่ตัวเลข
                                if (value.length != 10) {
                                    value = `${emoji(0x1000A6)}เบอร์โทรไม่ครบ 10 หลักundefined`
                                } else {
                                    if (value.substr(0, 2) == '00') {
                                        value = value.substr(1, 10)
                                    }
                                }
                            }
                        } else {
                            value = Number(value.replace(/\D/g, ''));
                        }
                        return { [key]: value };
                    }
                }));

            data.price = data.banks ? data.banks.map(b => b.price).reduce((le, ri) => Number(le) + Number(ri)) || 0 : 0
            data.bank = data.banks ? data.banks.map(bank => {
                let checkBank = false;
                if (bank.name.indexOf('COD') > -1) {
                    if (['K', 'F'].indexOf(data.name.substr(0, 1)) > -1) {
                        checkBank = true;
                    }
                } else {
                    if (['K', 'F'].indexOf(data.name.substr(0, 1)) > -1) {
                        checkBank = true;
                    }
                }
                return checkBank
                    ? bank.name + ' ' + (bank.date == '000000' ? '' : moment(bank.date, 'YYYYMMDD').format('DD/MM/YY')) + ' ' + (bank.time == '00.00' ? '' : bank.time+'น.') + '=' + formatMoney(bank.price, 0)
                    : `${emoji(0x1000A6) + bank.name}undefined`
                // return bank.name.indexOf('COD') > -1 && ['A', 'K', 'C'].indexOf(data.name.substr(0, 1)) == -1
                //     ? `${emoji(0x1000A6) + bank.name}undefined`
                //     : bank.name + (bank.time == '00.00' ? '' : bank.time) + '=' + formatMoney(bank.price, 0)

            }).reduce((le, ri) => le + ',' + ri) : emoji(0x1000A6) + 'undefined';
            data.edit = data.edit ? data.edit : false;
            if (data.channel) {
                if (data.channel.length != 1) {
                    data.channel = `${emoji(0x1000A6)}ไม่ได้ใส่ช่องทางโฆษณาundefined`
                } else {
                    if (data.page.indexOf('@') > -1) {
                        if (['O', 'N', 'F'].indexOf(data.channel) == -1) {
                            data.channel = `${emoji(0x1000A6)}ใส่ช่องทางโฆษณาได้เพียง O,N,F เท่านั้นundefined`
                        }
                    } else {
                        if (['O', 'N'].indexOf(data.channel) == -1) {
                            data.channel = `${emoji(0x1000A6)}ใส่ช่องทางโฆษณาได้เพียง O,N เท่านั้นundefined`
                        }
                    }
                }
            } else {
                if (['CM'].indexOf(data.bank.match(/[a-zA-Z]+/g, '')) > -1) {
                    data.channel = 'O';
                } else {
                    data.channel = `${emoji(0x1000A6)}ไม่ได้ใส่ช่องทางโฆษณาundefined`
                }
            }
            const refs = orders.map(order => db.collection('products').doc(order.code));
            return db.getAll(...refs)
                .then(snapShot => {
                    let products = [];
                    snapShot.forEach(doc => {
                        if (doc.exists)
                            products.push({ id: doc.id, ...doc.data() })
                    })
                    data.costs = 0;
                    for (var order in data.product) {
                        const code = data.product[order]['code'];
                        const amount = data.product[order]['amount'];
                        const product = products.find(f => f.id === data.product[order]['code'])
                        if (product) {
                            if (amount > 0) {
                                if (product.amount >= amount) {
                                    const thisCost = (product.cost || 0) * amount;
                                    data.costs += thisCost;
                                    data.product[order]['name'] = product.name;
                                    data.product[order]['cost'] = product.cost || 0;
                                    data.product[order]['costs'] = thisCost;
                                    data.product[order]['unit'] = product.unit;
                                    data.product[order]['typeId'] = product.typeId;
                                    data.product[order]['typeName'] = product.typeName;
                                } else {
                                    data.product[order]['code'] = `${emoji(0x1000A6)}undefined` + code;
                                    data.product[order]['name'] = 'เหลือเพียง';
                                    data.product[order]['amount'] = product.amount;
                                    data.product[order]['unit'] = product.unit;
                                }
                            } else {
                                data.product[order]['code'] = code;
                                data.product[order]['name'] = `${emoji(0x1000A6)}จำนวนสินค้าไม่ถูกต้อง`;
                                data.product[order]['amount'] = 'undefined';
                            }
                        } else {
                            data.product[order]['code'] = `${emoji(0x1000A6)}รหัส` + code;
                            data.product[order]['name'] = 'ไม่มีในรายการสินค้า';
                            data.product[order]['amount'] = 'undefined';
                        }
                    }
                    if (['CM', 'XX'].indexOf(data.bank.match(/[a-zA-Z]+/g, '')) > -1) {
                        if (data.costs > data.price) {
                            data.costs = `${emoji(0x1000A6)}undefinedจำนวนสินค้าหรือราคาสินค้าไม่ถูกต้อง`;
                        }
                    }
                    let text = formatOrder(data);
                    const indexUndefined = text.indexOf('undefined');
                    let success = true;
                    if (indexUndefined > -1) {
                        // const t = text.substring(0, indexUndefined - 1).split(' ');
                        // text = `${emoji(0x1000A6)} รายการสั่งของคุณไม่ถูกต้องค่ะ\nกรุณาตรวจสอบ ${t[t.length - 1]}`;
                        success = false;
                    }
                    // return { text, success, data };
                    return { text: text.replace(/undefined/g, ''), success, data };
                })
        })

}
const initMsgOrderKH = (txt) => {
    return db.collection('pages')
        .where('country', '==', 'KH')
        .get()
        .then(snapShotPages => {
            let pages = [];
            snapShotPages.forEach(page => {
                pages.push(page.id)
                pages.push('@' + page.id)
            })
            let orders = [];
            let data = Object.assign(...txt.split('#').filter(f => f != "")
                .map(m => {
                    if (m.split(':').length == 2) {
                        const dontReplces = ["name", "fb", "addr"];
                        let key = m.split(':')[0].toLowerCase().replace(/\s/g, '');;
                        switch (key) {
                            case 'n': key = 'name'; break;
                            case 't': key = 'tel'; break;
                            case 'a': key = 'addr'; break;
                            case 'o': key = 'product'; break;
                            // case 'b': key = 'bank'; break;
                            case 'b': key = 'banks'; break;
                            // case 'p': key = 'price'; break;
                            case 'e': key = 'edit'; break;
                            case 'f': key = 'fb'; break;
                            case 'l': key = 'fb'; break;
                            case 'z': key = 'page'; break;
                            case 'd': key = 'delivery'; break;
                            case 'cutoffdate': key = 'cutoffDate'; break;
                            default: key;
                        }
                        let value = m.split(':')[1];
                        if (!dontReplces.includes(key)) value = value.replace(/\s/g, '');
                        if (key !== 'addr' && key !== 'fb' && key !== 'id') value = value.replace(/\n/g, '').toUpperCase();
                        if (key == 'tel') {
                            value = value.replace(/\D/g, ''); //เหลือแต่ตัวเลข
                            if (value.length < 9 || value.length > 10) {
                                value = `${emoji(0x1000A6)}เบอร์โทรไม่ครบ 9 หรือ 10 หลักundefined`
                            }
                        }
                        if (key !== 'price' && key !== 'delivery') {
                            value = value.trim();
                            if (key == 'product') {
                                const str = value;
                                // let orders = [];
                                let arr = str.split(',');
                                for (var a in arr) {
                                    if (arr[a].split('=').length == 2) {
                                        const code = 'KH-' + arr[a].split('=')[0].toUpperCase();
                                        const amount = Number(arr[a].split('=')[1].replace(/\D/g, ''));
                                        const orderIndex = orders.findIndex(f => f.code == code);
                                        if (orderIndex > -1 && amount > 0) {
                                            orders[orderIndex]['amount'] = orders[orderIndex]['amount'] + amount
                                        } else {
                                            orders.push({
                                                code,
                                                amount,
                                                name: ''
                                            })
                                        }
                                    } else {
                                        const orderIndex = orders.findIndex(f => f.code == 'รหัสสินค้า');
                                        if (orderIndex > -1) {

                                        } else {
                                            orders.push({
                                                code: `${emoji(0x1000A6)}รหัสสินค้าไม่ถูกต้อง`,
                                                amount: 'undefined'
                                            })
                                        }
                                    }
                                }
                                value = orders;
                            } else if (key == 'page') {
                                if (pages.indexOf(value) == -1) {
                                    value = `${emoji(0x1000A6)}undefined`;
                                }
                                // } else if (key == 'name') {
                                // const deliver = value.substr(0, 1).toUpperCase();
                                // if (express.indexOf(deliver) == -1) {
                                //     value = `${emoji(0x1000A6)}undefined`;
                                // }
                            } else if (key == 'banks') {

                                const str = value;
                                let arr = str.split(',');
                                let banks = [];
                                for (var a in arr) {
                                    if (arr[a].split('=').length == 2) {
                                        const bank1 = arr[a].split('=')[0].toUpperCase();
                                        let price = Number(arr[a].split('=')[1].replace(/\D/g, ''));
                                        let name = '';
                                        let time = '00.00';
                                        let date = '000000';
                                        if (bank1.match(/[a-zA-Z]+/g, '') == null) {
                                            name = `${emoji(0x1000A6)}ธนาคารundefined`;
                                            time = 'undefined';
                                        }
                                        if (bank1.match(/\d{6}/g) == null && ['COD', 'CM', 'XX', 'CP'].indexOf(bank1) == -1) {
                                            name = bank1.match(/[a-zA-Z]+/g, '')[0];
                                            date = `${emoji(0x1000A6)}วันที่โอนundefined`;
                                            price = 'undefined';
                                        }
                                        if (bank1.match(/\d{2}\.\d{2}/g) == null && ['COD', 'CM', 'XX', 'CP'].indexOf(bank1) == -1) {
                                            name = bank1.match(/[a-zA-Z]+/g, '')[0];
                                            time = `${emoji(0x1000A6)}เวลาโอนundefined`;
                                            price = 'undefined';
                                        }
                                        if (price != 'undefined') {
                                            name = bank1.match(/[a-zA-Z]+/g, '')[0];
                                            date = ['COD', 'CM', 'XX', 'CP'].indexOf(bank1) == -1 ?
                                                moment(bank1.match(/\d{6}/g)[0], 'DDMMYY').isValid() ?
                                                    moment(bank1.match(/\d{6}/g)[0], 'DDMMYY').format('YYYYMMDD') : `${emoji(0x1000A6)}วันที่โอนundefined`
                                                : date;
                                            time = ['COD', 'CM', 'XX', 'CP'].indexOf(bank1) == -1 ? bank1.match(/\d{2}\.\d{2}/g)[0] : time;
                                        }
                                        banks.push({
                                            name,
                                            date,
                                            time,
                                            price
                                        })
                                    } else {
                                        banks.push({
                                            name: arr[a].toUpperCase(),
                                            price: `${emoji(0x1000A6)}ยอดเงินundefined`
                                        })
                                    }
                                }
                                value = banks
                            } else if (key == 'edit') {
                                if (value == 'Y') {
                                    value = true;
                                } else if (value == 'N') {
                                    value = false
                                } else {
                                    value = `${emoji(0x1000A6)}แก้ไขต้องเป็น Y หรือ N เท่านั้นจ้าundefined`
                                }
                            }
                        } else {
                            value = Number(value.replace(/\D/g, ''));
                        }
                        return { [key]: value };
                    }
                }));

            data.price = data.banks ? data.banks.map(b => b.price).reduce((le, ri) => Number(le) + Number(ri)) || 0 : 0
            data.bank = data.banks ? data.banks.map(bank => {
                let checkBank = true;
                // if (bank.name.indexOf('COD') > -1) {
                //     if (['C', 'A', 'K'].indexOf(data.name.substr(0, 1)) > -1) {
                //         checkBank = true;
                //     }
                // } else {
                //     if (['A', 'K', 'M', 'R'].indexOf(data.name.substr(0, 1)) > -1) {
                //         checkBank = true;
                //     }
                // }
                return checkBank
                    ? bank.name + ' ' + (bank.date == '000000' ? '' : moment(bank.date, 'YYYYMMDD').format('DD/MM/YY')) + ' ' + (bank.time == '00.00' ? '' : bank.time) + '=' + formatMoney(bank.price, 0)
                    : `${emoji(0x1000A6) + bank.name}undefined`

            }).reduce((le, ri) => le + ',' + ri) : emoji(0x1000A6) + 'undefined';
            data.edit = data.edit ? data.edit : false;
            const refs = orders.map(order => db.collection('products').doc(order.code));
            return db.getAll(...refs)
                .then(snapShot => {
                    let products = [];
                    snapShot.forEach(doc => {
                        if (doc.exists)
                            products.push({ id: doc.id, ...doc.data() })
                    })
                    data.costs = 0;
                    for (var order in data.product) {
                        const code = data.product[order]['code'];
                        const amount = data.product[order]['amount'];
                        const product = products.find(f => f.id === data.product[order]['code'])
                        if (product) {
                            if (amount > 0) {
                                if (product.amount >= amount) {
                                    const thisCost = (product.cost || 0) * amount;
                                    data.costs += thisCost;
                                    data.product[order]['name'] = product.name;
                                    data.product[order]['cost'] = product.cost || 0;
                                    data.product[order]['costs'] = thisCost;
                                    data.product[order]['unit'] = product.unit;
                                    data.product[order]['typeId'] = product.typeId;
                                    data.product[order]['typeName'] = product.typeName;
                                } else {
                                    data.product[order]['code'] = `${emoji(0x1000A6)}undefined` + code;
                                    data.product[order]['name'] = 'เหลือเพียง';
                                    data.product[order]['amount'] = product.amount;
                                    data.product[order]['unit'] = product.unit;
                                }
                            } else {
                                data.product[order]['code'] = code;
                                data.product[order]['name'] = `${emoji(0x1000A6)}จำนวนสินค้าไม่ถูกต้อง`;
                                data.product[order]['amount'] = 'undefined';
                            }
                        } else {
                            data.product[order]['code'] = `${emoji(0x1000A6)}รหัส` + code;
                            data.product[order]['name'] = 'ไม่มีในรายการสินค้า';
                            data.product[order]['amount'] = 'undefined';
                        }
                    }
                    if (['CM', 'XX'].indexOf(data.bank.match(/[a-zA-Z]+/g, '')) > -1) {
                        if (data.costs > data.price) {
                            data.costs = `${emoji(0x1000A6)}undefinedจำนวนสินค้าหรือราคาสินค้าไม่ถูกต้อง`;
                        }
                    }
                    let text = formatOrderKH(data);
                    const indexUndefined = text.indexOf('undefined');
                    let success = true;
                    if (indexUndefined > -1) {
                        // const t = text.substring(0, indexUndefined - 1).split(' ');
                        // text = `${emoji(0x1000A6)} รายการสั่งของคุณไม่ถูกต้องค่ะ\nกรุณาตรวจสอบ ${t[t.length - 1]}`;
                        success = false;
                    }
                    // return { text, success, data };
                    return { text: text.replace(/undefined/g, ''), success, data };
                })
        })

}

const formatOrder = (data) => {
    //${data.delivery > 0 ? '' : `ค่าจัดส่ง: ${emoji(0x1000A6)}undefined`} 
    //${data.channel.length == 1 ? '' : data.channel}
    return `
ชื่อ: ${data.name ? data.name : `${emoji(0x1000A6)}undefined`} 
เบอร์โทร: ${data.tel ? data.tel : `${emoji(0x1000A6)}undefined`}  
ที่อยู่: ${data.addr ? data.addr : `${emoji(0x1000A6)}undefined`} 
รายการสินค้า: ${data.product
            ? data.product.map((p, i) => '\n' + p.code + ':' + p.name + '=' + p.amount + (p.amount == 'undefined' ? '' : ' ' + p.unit))
            : `${emoji(0x1000A6)}undefined`} 
ธนาคาร: ${data.bank} ${isNaN(data.costs) ? data.costs : ''}
รวมยอดชำระ: ${formatMoney(data.price, 0)}บาท 
FB/Line: ${data.fb ? data.fb : `${emoji(0x1000A6)}undefined`} ${data.channel.length == 1 ? '' : data.channel}
เพจ: ${data.page ? data.page : `${emoji(0x1000A6)}undefined`}`;
}
const formatOrderKH = (data) => {
    return `
Name: ${data.fb ? data.fb : `${emoji(0x1000A6)}undefined`}
Tel: ${data.tel ? data.tel : `${emoji(0x1000A6)}undefined`}  
Address: ${data.addr ? data.addr : `${emoji(0x1000A6)}undefined`} 
Products: ${data.product
            ? data.product.map((p, i) => '\n' + p.code + ':' + p.name + '=' + p.amount + (p.amount == 'undefined' ? '' : ' ' + p.unit))
            : `${emoji(0x1000A6)}undefined`} 
Transfer Transactions: ${data.bank} ${isNaN(data.costs) ? data.costs : ''}
Amount: ${formatMoney(data.price, 0)}$  ${data.delivery >= 0 ? '' : `ค่าจัดส่ง: ${emoji(0x1000A6)}undefined`} 
Page: ${data.page ? data.page : `${emoji(0x1000A6)}undefined`}`;
}
const formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};
const yyyymmdd = () => {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    var now = new Date();
    return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
}
const fourDigit = (n) => {
    if (n < 10) {
        return '000' + n.toString();
    } else if (n < 100) {
        return '00' + n.toString();
    } else if (n < 1000) {
        return '0' + n.toString()
    } else {
        return n.toString();
    }
}
const emoji = (hex) => { return String.fromCodePoint(hex) };