require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1
    config.action_mailer.delivery_method = :smtp
    # config/environments/production.rb (or development.rb)
    config.action_mailer.delivery_method = :smtp
    config.action_mailer.smtp_settings = {
      address: 'smtp.gmail.com',
      port: 587,
      domain: 'localhost:3000', # Your domain (if applicable)
      user_name: 'your_email@gmail.com',
      password: 'password from 2 factor authentication',
      authentication: 'plain',
      enable_starttls_auto: true
    }


    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    # config.autoload_lib(ignore: %w(assets tasks))
    # config.assets.enabled = false
    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true
    config.session_store :cookie_store, key: '_interslice_session'
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options
    config.web_console.whitelisted_ips = '192.168.10.27'

    # require_relative 'boot'

    # OpenAI.configure do |config|
    #   config.access_token = 'YOUR_OPENAI_API_KEY'
    # end

    # require 'openai'

    # require_relative 'environment'    
    # Rails.application.initialize!

    
  end
end
