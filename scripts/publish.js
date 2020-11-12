const cmd = require('node-cmd');

cmd.get(
    'npm publish',
    function(err, data, stderr){
        if (data){
            console.log(data)
        }
    }
);