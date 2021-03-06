const D = require('./data');

exports.admin = function (ctx, grantOther) {

    let str = ctx.from.first_name + " ";
    let admins = D.data.getInfos(ctx)['admins'];

    if (!grantOther) {

        if (admins.length == 0){
            let admin = [ctx.from.id];

            D.data.setGroupAdmin(ctx, admin);

            str += "a activé le bot et est admin.";

            ctx.reply(str);
        }
        else return ctx.reply('Really ? ...');


    } else if (admins.indexOf(ctx.from.id) >= 0) {

        let newAdminId = ctx.message.text.split(' ')[1];

        if (typeof newAdminId === 'undefined'){
            str = 'List des admins : \r\n';
            let promises = [];
            for (let i = 0; i<admins.length; i++){
                promises[i] = ctx.telegram.getChatMember(ctx.chat.id, admins[i]);
            }
            Promise.all(promises).then(function (values){
                for (let i = 0; i<admins.length; i++)
                    str += values[i].user.username + "\r\n";
                return ctx.reply(str);
            });
            return;
        }

        newAdminId = parseInt(newAdminId);

        if (isNaN(newAdminId)) {
            str = "This is not a user id!";
            return ctx.reply(str);
        }

        if (admins.indexOf(newAdminId) >= 0) {
            str = "Already an admin!";
            return ctx.reply(str);
        }

        let promise = ctx.telegram.getChatMember(ctx.chat.id, newAdminId);

        promise.then(function (userInfo) {
            let member = userInfo.user.username;

            admins.push(newAdminId);

            D.data.setGroupAdmin(ctx, admins);

            str += "a ajouté " + member + " aux admins!\r\n";
            str += "Liste des admins : \r\n";

            for (let i = 0; i<admins.length; i++){
                str += admins[i] + "\r\n";
            }

            ctx.reply(str);
        });

        promise.catch(function(error) {
            ctx.reply('No user found for id ' + newAdminId + ' \r\n' +
                'Please check if id is correct!');
        });

    } else {
        return ctx.reply('No!');//https://www.youtube.com/watch?v=HALdRZVDB_k');
    }

};
