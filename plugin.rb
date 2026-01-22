# frozen_string_literal: true

# name: discourse-hard-mode
# about: Vim-style hard mode for Discourse - disable mouse navigation, use keyboard only
# version: 20260121
# authors: ducks
# url: https://github.com/ducks/discourse-hard-mode
# required_version: 2.7.0

enabled_site_setting :hard_mode_enabled

register_svg_icon "keyboard"
register_svg_icon "mouse-pointer"

after_initialize do
  # Register the custom field for tracking shame count
  User.register_custom_field_type("hard_mode_shame_count", :integer)

  # Allow users to write their own shame count
  register_editable_user_custom_field :hard_mode_shame_count

  # Add to user serializer so it's available on user cards
  add_to_serializer(:user, :hard_mode_shame_count) do
    object.custom_fields["hard_mode_shame_count"].to_i
  end

  # Add to current user serializer for the logged-in user
  add_to_serializer(:current_user, :hard_mode_shame_count) do
    object.custom_fields["hard_mode_shame_count"].to_i
  end

  # Add to post serializer via the user so we can display on posts
  add_to_serializer(:post, :hard_mode_shame_count) do
    object.user&.custom_fields&.dig("hard_mode_shame_count").to_i
  end
end
