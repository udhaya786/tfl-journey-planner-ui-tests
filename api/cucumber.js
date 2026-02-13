module.exports = {
    default: {
      require: ['api/step-definitions/**/*.ts'],
      requireModule: ['ts-node/register'],
      format: ['progress'],
      paths: ['api/features/**/*.feature']
    }
  };
  