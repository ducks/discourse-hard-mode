import Component from "@glimmer/component";
import UserStat from "discourse/components/user-stat";

export default class HardModeShame extends Component {
  get shameCount() {
    return this.args.outletArgs?.user?.hard_mode_shame_count || 0;
  }

  get hasShame() {
    return this.shameCount > 0;
  }

  <template>
    {{#if this.hasShame}}
      <UserStat
        @value={{this.shameCount}}
        @icon="mouse-pointer"
        @label="hard_mode.blocked_clicks_label"
      />
    {{/if}}
  </template>
}
