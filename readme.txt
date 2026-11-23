--Readme document for Stella Jiang and Zexi (Tracy) Chen--

Student information to complete before submission:
- Stella Jiang: [UCI EMAIL], [STUDENT ID]
- Zexi (Tracy) Chen: [UCI EMAIL], [STUDENT ID]
- Canvas A4 group: [GROUP NUMBER]

1. How many assignment points do you believe you completed?

11/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Backing up logged data with Ionic Storage
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video explaining the features and design rationale
- 1 extra-credit point: both local storage and a native device resource (Local Notifications)

The Local Notifications extra-credit claim depends on the final demo showing the feature on an iOS simulator or physical iOS device, as required by the assignment.

2. How long, in hours, did it take you to complete this assignment?

[ADD TOTAL HOURS, with Tracy and Stella hours listed separately.]

3. What online resources did you consult when completing this assignment? (list specific URLs)

- 2026 INF 133 A4 requirements: https://inf133-wi26.depstein.net/a4
- Ionic components: https://ionicframework.com/docs/components
- Ionic Storage: https://github.com/ionic-team/ionic-storage
- Capacitor Local Notifications: https://capacitorjs.com/docs/apis/local-notifications
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/designing-for-ios
- Stanford Sleepiness Scale: https://www.med.upenn.edu/cbti/assets/user-content/documents/Stanford%20Sleepiness%20Scale.pdf

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

Stella Jiang and Tracy Chen worked as partners. Tracy implemented the foundation, logging, data models, storage, seed data, and Today view; Stella implemented History, statistics, editing/deleting with undo, local-notification reminders, final polish, and demo preparation.

5. Is there anything special we need to know in order to run your code?

From `sleeptracker`, run `npm install` and `ionic serve` for browser testing. Native notifications require Xcode/iOS Simulator or an iPhone: run `npm run build`, `npx cap sync ios`, and `npx cap open ios`, then allow notification permission when saving reminders.

--Aim for no more than two sentences for each of the following questions.--

6. Did you design your app with a particular type of user in mind? If so, whom?

We designed for college students whose bedtimes vary and who need very quick daytime check-ins. Seed data, optional context tags, and reminders make patterns visible without turning logging into a large task.

7. Did you design your app specifically for iOS or Android, or both?

We prioritized iOS conventions while retaining Ionic's cross-platform components. The app uses bottom-tab navigation, sheet-style editing, concise toolbars, swipe actions, large touch targets, and system permission prompts.

8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

The Sleep tab starts with last night at 11 PM and this morning at 7 AM, then lets the user adjust both times and optionally add quality and notes. This morning-after model matches how students remember a completed night and prevents future or backwards time ranges.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

The Sleepiness tab presents all seven Stanford levels with their descriptions, plus optional context and notes. Large rows make the scale understandable before selection, while daily notifications reduce the burden of remembering experience-sampling check-ins.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

History groups each night's sleep and that day's sleepiness check-ins together, with a seven-day duration chart and average summaries above the timeline. This supports both a quick weekly pattern check and detailed review without forcing users to switch between separate datasets.

11. Which feature did you choose--using a native device resource, backing up logged data, or both?

Both. Ionic Storage persists overnight and sleepiness records, while Capacitor Local Notifications provides recurring sleepiness reminders.

12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

Users can choose up to five daily Local Notification times, and tapping a reminder opens the Sleepiness logging page. The reminder turns experience sampling from a task users must remember into a timely, one-tap check-in flow.

13. If you backed up logged data, where does it back up to?

Both record categories are stored through Ionic Storage, which uses IndexedDB in the browser and an appropriate persistent local driver on a native platform. Writes finish before the UI reports success, so saved, edited, deleted, and restored entries survive a reload.

14. How does your app implement or follow principles of good mobile design?

Today provides a useful initial view, validation prevents invalid or duplicate nights, and every delete offers an Undo toast as the lecture's “uh-oh” recovery. The interface also follows iOS-oriented tab, toolbar, modal, swipe-action, touch-target, and concise color/typography conventions.

--Demo recording checklist (target: about 60 seconds)--

Record the final demo on an iOS simulator or physical iPhone so the notification qualifies as a native-resource feature. Replace the timestamps below after recording and save the video as `demo.mp4` in the repository root.

- [00:00] Today view and navigation
- [00:05] Log overnight sleep, including validation/quality
- [00:16] Log a Stanford Sleepiness Scale check-in
- [00:25] History chart, averages, and grouped records
- [00:34] Swipe to edit a record
- [00:41] Swipe to delete, then tap Undo
- [00:47] Configure reminder times and grant notification permission
- [00:53] Show a delivered notification and tap it to open Sleepiness
- [00:58] Reload/relaunch and show that records persist

--Submission checklist--

- Fill in both students' emails, IDs, group number, hours, and actual demo timestamps.
- Verify notification delivery and notification-tap routing on iOS Simulator/device.
- Put `demo.mp4` in the repository root.
- Remove `node_modules`, `.angular`, and other generated caches before creating the submission ZIP.
- Include source code, `package.json`, `package-lock.json`, native iOS project, `readme.txt`, and demo video.
- Each partner must separately complete the Canvas work-distribution evaluation with answers matching the split above.
