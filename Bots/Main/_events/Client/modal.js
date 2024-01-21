const { Event } = require("../../../../Global/Structures/Default.Events");
const { EmbedBuilder,PermissionsBitField,InteractionType, ActionRowBuilder, ButtonBuilder, ButtonStyle,ModalBuilder ,TextInputStyle, SelectMenuBuilder,TextInputBuilder , Formatters, ActionRow,FileType} = require("discord.js");
const {Guild} = require("../../../../Global/Config/Guild")
const {Collection} = require("discord.js")
const panel = require("../../../../Global/Database/bpanel")
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr")
class modalsubmit extends Event {
    constructor(client) {
        super(client, {
            name: "interactionCreate",
            enabled: true,
        });    
    }    

 async onLoad(interaction) {
    if (interaction.type != InteractionType.ModalSubmit) return;
      if (interaction.customId === 'oluşturrol') {
        const existingData = await panel.findOne({ userID: interaction.user.id, guildID: interaction.guild.id });
      
        if (!existingData) {
          const acıklama = await interaction.fields.getTextInputValue("rolisim");
          const gönderibu = await interaction.fields.getTextInputValue("rolrenk");
          const rolab = await interaction.fields.getTextInputValue("rolicon");
      
          const rol31 = interaction.guild.roles.cache.get(interaction.guild.roles.cache.filter(x => x.tags?.premiumSubscriberRole == true).map(x => x.id)[0]);
          const createdRole2 = await interaction.guild.roles.create({
            name: acıklama,
            color: gönderibu,
            position: rol31.position + 1,
          });
      
          await panel.create({
            userID: interaction.user.id,
            guildID: interaction.guild.id,
            bpanelrol: createdRole2.id,
            bpanelrenk: gönderibu,
            rolicon: rolab,
            date: Date.now()
          });
          await interaction.member.roles.add(createdRole2.id);
          await interaction.reply({ content: `${createdRole2.name} İsimli Rol Oluşturuldu`, ephemeral: true });
        } else {
          await interaction.reply({ content: "Bu işlem daha önce zaten gerçekleştirilmiş.", ephemeral: true });
        }
      }
      if (interaction.customId === 'düzenle2') {
        const existingData = await panel.findOne({ userID: interaction.user.id, guildID: interaction.guild.id });
        if (existingData) {
          const acıklama = await interaction.fields.getTextInputValue("rolisim");
          const gönderibu = await interaction.fields.getTextInputValue("rolrenk");
          const rolab = await interaction.fields.getTextInputValue("rolicon");
          const rolToUpdate = interaction.guild.roles.cache.get(existingData.bpanelrol);
          if (rolToUpdate) {
            await rolToUpdate.edit({
              name: acıklama,
              color: gönderibu,
            });

            await panel.updateOne(
              { userID: interaction.user.id, guildID: interaction.guild.id },
              {
                $set: {
                  bpanelrol: rolToUpdate.id,
                  bpanelrenk: gönderibu,
                  rolicon: rolab,
                  date: Date.now(),
                },
              }
            );
        
            await interaction.reply({ content: `${acıklama} İsimli Rol Başarıyla Güncellendi`, ephemeral: true });
          } else {
            await interaction.reply({ content: 'Güncellenecek rol bulunamadı.', ephemeral: true });
          }
        } else {
          await interaction.reply({ content: 'Panel verisi bulunamadı. Önce bir rol oluşturmalısınız.', ephemeral: true });
        }
      }
      if (interaction.customId === 'alver2') {
        const kullanıcı = await interaction.fields.getTextInputValue("alıncakverilcek");
        const maxArrayLength = 3;

        const doc = await panel.findOne({
          userID: interaction.user.id,
          guildID: interaction.guild.id,
        });
        
        if (doc) {
          if (doc.kullanıcılar.length + 1 > maxArrayLength) {
            await interaction.reply({ content: 'Sınıra ulaşıldı. Daha fazla rol atayamazsınız.', ephemeral: true });
          } else {
            var usersArr = doc.kullanıcılar
            if(doc.kullanıcılar.some(x=> x === kullanıcı)) {
              usersArr = removeToID(kullanıcı,usersArr);
              interaction.guild.members.cache.get(kullanıcı)?.roles.remove(doc.bpanelrol)
              await interaction.reply({ content: `${kullanıcı} idli kullanıcıdan rol alındı.`, ephemeral: true });

            } else {
              usersArr.push(kullanıcı)
            interaction.guild.members.cache.get(kullanıcı)?.roles.add(doc.bpanelrol)
            await interaction.reply({ content: `${kullanıcı} idli kullanıcıya rol verildi.`, ephemeral: true });
            }
            await panel.findOneAndUpdate(
              {
                userID: interaction.user.id,
                guildID: interaction.guild.id,
              },
              {
                kullanıcılar: usersArr, 
              }
            );
          }
        } else {
          await interaction.reply({ content: `Rolünüz Bulunmamakta Rol Oluşturunuz`, ephemeral: true });
        }
      }
  } 

  

}    


module.exports = modalsubmit;
function removeToID(ID,Array){
  const index = Array.indexOf(ID);
  if(index !== -1){
    Array.splice(index,1)
  }
  return Array
}