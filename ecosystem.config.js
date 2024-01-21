let sunucu = "TEST"
module.exports = {
  apps: [
    {
      name: sunucu+"-Mainframe",
      namespace: "luhux",
      script: 'main.js',
      watch: false,
      exec_mode: "cluster",
      max_memory_restart: "2G",
      cwd: "./Bots/Main"
    }
  ]
};