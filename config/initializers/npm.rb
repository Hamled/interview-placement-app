# Install NPM packages at server startup
system 'npm install' if Rails.env.development? || Rails.env.test?
