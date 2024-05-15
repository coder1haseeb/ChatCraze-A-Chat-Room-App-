require "test_helper"

class Api::EmailsControllerTest < ActionDispatch::IntegrationTest
  test "should get send_email" do
    get api_emails_send_email_url
    assert_response :success
  end
end
