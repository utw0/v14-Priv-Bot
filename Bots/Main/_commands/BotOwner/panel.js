
const { EmbedBuilder,PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle ,Formatters,ModalBuilder,TextInputBuilder ,TextInputStyle} = require("discord.js");
const { Command } = require("../../../../Global/Structures/Default.Commands");
const { post } = require("node-superfetch");
const {Guild} = require("../../../../Global/Config/Guild")
const panel = require("../../../../Global/Database/bpanel")
class BoosterPanel extends Command {
    constructor(client) {
        super(client, {
            name: "panel",
            description: "Boosterlere Özel Panel",
            usage: ".luhuxpanel ",
            category: "luhux",
            aliases: ["panel","panelabicim"],

            enabled: true,
            guildOwner:true,
            developer : true
        });
    }
    

    onLoad(client) {
      client.on("interactionCreate", async (i) => {
        const guild = client.guilds.cache.get(Guild.ID);
        let menu = i.customId;
        const member = guild.members.cache.get(i.member.id);
        if (!member) return;
        if (menu == "oluştur") {
          const modal = new ModalBuilder()
            .setCustomId("oluşturrol")
            .setTitle("Rol Oluşturma Sistemi")
            .setComponents(
              new ActionRowBuilder()
                .addComponents(
                  new TextInputBuilder()
                    .setCustomId("rolisim")
                    .setLabel("Rol İsim")
                    .setPlaceholder('luhuxuncıtırları')
                    .setStyle(TextInputStyle.Short)
                ),
              new ActionRowBuilder()
                .addComponents(
                  new TextInputBuilder()
                    .setCustomId("rolrenk")
                    .setLabel("Rol Renk")
                    .setPlaceholder('#520847 (Doğru Renk Kodu Girin)')
                    .setStyle(TextInputStyle.Short)
                ),
              new ActionRowBuilder()
                .addComponents(
                  new TextInputBuilder()
                    .setCustomId("rolicon")
                    .setLabel("Rol Emoji")
                    .setPlaceholder('Bağlantı Olarak Girin')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)
                ),
            );
          
            return await i.showModal(modal, { client: client, interaction: i });
          
        }
        if (menu == "alver") {
          const modal = new ModalBuilder()
            .setCustomId("alver2")
            .setTitle("Rol Oluşturma Sistemi")
            .setComponents(
              new ActionRowBuilder()
                .addComponents(
                  new TextInputBuilder()
                    .setCustomId("alıncakverilcek")
                    .setLabel("Verilcek/Alıncak Kullanıcı İD")
                    .setPlaceholder('341592492224806914')
                    .setStyle(TextInputStyle.Short)
                ),
            );       
            return await i.showModal(modal, { client: client, interaction: i });
        }
        if (menu == "düzenle") {
          const modal = new ModalBuilder()
            .setCustomId("düzenle2")
            .setTitle("Rol Düzenleme Sistemi")
            .setComponents(
              new ActionRowBuilder()
              .addComponents(
                new TextInputBuilder()
                  .setCustomId("rolisim")
                  .setLabel("Rol İsim")
                  .setPlaceholder('luhuxuncıtırları')
                  .setStyle(TextInputStyle.Short)
              ),
            new ActionRowBuilder()
              .addComponents(
                new TextInputBuilder()
                  .setCustomId("rolrenk")
                  .setLabel("Rol Renk")
                  .setPlaceholder('#520847 (Doğru Renk Kodu Girin)')
                  .setStyle(TextInputStyle.Short)
              ),
            new ActionRowBuilder()
              .addComponents(
                new TextInputBuilder()
                  .setCustomId("rolicon")
                  .setLabel("Rol Emoji")
                  .setPlaceholder('Bağlantı Olarak Girin')
                  .setStyle(TextInputStyle.Short)
                  .setRequired(false)
              ),
            );       
            return await i.showModal(modal, { client: client, interaction: i });
        }
        if (menu == "görüntüle") {
    
          const data = await panel.findOne({ userID: i.user.id, guildID: i.guild.id });
          if (!data) {
            i.reply({ content: 'Veri bulunamadı.', ephemeral: true });
          } else {
            const role = i.guild.roles.cache.get(data.bpanelrol);
            const user = role.members.map(member => `<@${member.id}>`);
            i.reply({ content: `Rol İsim : **${role.name}**\nRol ID: **${data.bpanelrol}**\nRol Renk: **${data.bpanelrenk}**\nRolde Olan Kullanıcılar: **${user.join(', ')}**`, ephemeral: true });
          }
        }
        if (menu == "sil") {
          const userData = await panel.findOne({ userID: i.user.id, guildID: i.guild.id });
        
          if (userData) {
            const roleId = userData.bpanelrol;
            const roleToDelete = i.guild.roles.cache.get(roleId);
            if (roleToDelete) {
              await roleToDelete.delete();
            }
            await panel.findOneAndDelete({ userID: i.user.id, guildID: i.guild.id });
            await i.reply({ content: "Rol ve veri başarıyla silindi.", ephemeral: true });
          } else {
            await i.reply({ content: "Zaten veri yok, silecek bir şey yok.", ephemeral: true });
          }
        }
      });
      
    }

 async onRequest (client, message, args) {
    const row = new ActionRowBuilder()
    .addComponents(
     new ButtonBuilder().setLabel("Rol Oluştur").setCustomId("oluştur").setStyle(ButtonStyle.Success),
     new ButtonBuilder().setLabel("Rolünü Ver/Al").setCustomId("alver").setStyle(ButtonStyle.Success),
     new ButtonBuilder().setLabel("Rolünü Düzenle").setCustomId("düzenle").setStyle(ButtonStyle.Success),
     new ButtonBuilder().setLabel("Rolünü Görüntüle").setCustomId("görüntüle").setStyle(ButtonStyle.Success),
     new ButtonBuilder().setLabel("Rolü Sil").setCustomId("sil").setStyle(ButtonStyle.Danger),
    )
 
    message.channel.send({content:"**Aşağıda ki butonlar ile rolünüzü açabilirsiniz\n\nRolünüzü istediğiniz 3 kişiye verebilirsiniz\n\nRolünüzü tekrardan düzenleyebilirsiniz\n\nRolünüzde olan kişileri ve rol hakkında bilgi alabilirsiniz**", components:[row]})
}
}
module.exports = BoosterPanel;