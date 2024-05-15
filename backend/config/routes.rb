Rails.application.routes.draw do
  mount ActionCable.server => '/cable'
  get '/my-chats' , to: "chats#my_chats"
  get '/chats/:name' , to: "chats#search_chats"
  get '/show-members/:id', to: "chats#show_members"
  delete 'delete-user-by-admin' , to: "memberships#custom_delete"
  resources :chats do
    resources :messages
  end
  get 'memberships/create'
  resources :memberships
  post '/send_email' , to: "emails#send_email"
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: "users/registrations",
    confirmations: 'users/confirmations'
  }
  post '/chat/suggest_message', to: 'messages#suggest_message'
end