const ipc = require('node-ipc')
const { exec, execSync } = require('child_process');
ipc.config.id = "world";
ipc.config.retry = 1500;

ipc.serve(
    function () {
        ipc.server.on(
            'message',
            function (data, socket) {
                ipc.log('got a message: ', data)
                console.log("got a message")
            }
        );
        ipc.server.on('update', function (data, socket) {
            console.log('update triggered')
            update(data);
        })
        ipc.server.on('socket.disconnected',
            function (socket, destroyedSocketID) {
                ipc.log("client " + destroyedSocketID + " has disconnected")
            }
        )
    }

)

function update(path) {
    let cmd = "cd \'" + path + "\' && sleep 1 && git pull && yarn"; 
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log("update complete")
    });
    console.log('tried to run the command')
}

ipc.server.start();