var net = require('net');
var client = net.createConnection({port: 1200}, () => {
    console.log('客户端已经连接上远程了');
    // 发送消息
    client.write('SG*8800015*00CD*UD,180916,10029');
    // 发送消息并断开连接
    // client.end('\xFF\x0B\x00\x00\x00\x15\x00\x06\x04\x00\x00\x00\xF4');
});

client.on('data', function(data) {
    console.log(data.toString());
    client.end();
});
client.on('end', function() {
    console.log('断开与服务器的连接');
});