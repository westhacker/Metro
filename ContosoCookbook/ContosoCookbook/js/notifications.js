(function () {
    "use strict";

    var toast = Windows.UI.Notifications;

    WinJS.Namespace.define("notifications", {
        // Schedules a toast notification
        scheduleToast: function () {
            // Create a toast notifier
            var notifier = toast.ToastNotificationManager.createToastNotifier();

            // Make sure notifications are enabled
            if (notifier.setting != toast.NotificationSetting.enabled) {
                var dialog = new Windows.UI.Popups.MessageDialog("Notifications are currently disabled");
                dialog.showAsync();
                return;
            }

            // Get a toast template and insert a text node containing a message
            var template = toast.ToastNotificationManager.getTemplateContent(toast.ToastTemplateType.toastText01);
            var element = template.getElementsByTagName("text")[0];
            element.appendChild(template.createTextNode("Reminder!"));

            // Schedule the toast to appear 30 seconds from now
            var date = new Date(new Date().getTime() + 30000);
            var stn = toast.ScheduledToastNotification(template, date);
            notifier.addToSchedule(stn);
        }
    });
})();
