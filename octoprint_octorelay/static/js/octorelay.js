"use strict";
$(() => {
    const OctoRelayViewModel = function ([settingsViewModel, loginStateViewModel]) {
        const ownCode = "octorelay";
        const self = this;
        self.settingsViewModel = settingsViewModel;
        self.loginState = loginStateViewModel;
        self.onDataUpdaterPluginMessage = (plugin, data) => {
            if (plugin !== ownCode) {
                return;
            }
            const handleClick = (key, value) => {
                const command = () => OctoPrint.simpleApiCommand(ownCode, "update", { pin: key });
                if (!value.confirmOff) {
                    return command();
                }
                const dialog = $("#octorelay-confirmation-dialog");
                dialog.find(".modal-title").text("Turning " + value.labelText + " off");
                dialog
                    .find("#octorelay-confirmation-text")
                    .text("Are you sure you want to turn the " + value.labelText + " off?");
                dialog
                    .find(".btn-cancel")
                    .off("click")
                    .on("click", () => dialog.modal("hide"));
                dialog
                    .find(".btn-confirm")
                    .off("click")
                    .on("click", () => {
                    command();
                    dialog.modal("hide");
                });
                dialog.modal("show");
            };
            for (const [key, value] of Object.entries(data)) {
                const btn = $("#relais" + key);
                if (value.active !== undefined) {
                    btn.toggle(value.active === 1);
                }
                const icon = $("#ralayIcon" + key);
                if (value.iconText !== undefined) {
                    icon.html(value.iconText);
                }
                if (value.labelText !== undefined) {
                    icon.attr("title", value.labelText);
                }
                icon.off("click").on("click", () => handleClick(key, value));
            }
        };
    };
    OCTOPRINT_VIEWMODELS.push({
        construct: OctoRelayViewModel,
        dependencies: ["settingsViewModel", "loginStateViewModel"],
    });
});
