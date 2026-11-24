--Readme document for Stella Jiang (yuxuj10@uci.edu, 83089982) and Zexi (Tracy) Chen (zexic7@uci.edu, 76111328)--
--Canvas group: A4 Pair 31--

1. How many assignment points do you believe you completed?

11/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Backing up logged data with Ionic Storage
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video explaining the features and design rationale
- +1 bonus: we did both data backup (Ionic Storage) and a native device resource (Local Notifications)

2. How long, in hours, did it take you to complete this assignment?

About 17 hours in total. Tracy spent about 5 hours on her part and Stella about 6 hours on hers, and then we spent about 3 hours each working together on polish, testing and the demo.

3. What online resources did you consult when completing this assignment? (list specific URLs)

- A4 assignment page: https://inf133-wi26.depstein.net/a4
- Ionic components: https://ionicframework.com/docs/components
- ion-tabs (bottom tab bar): https://ionicframework.com/docs/api/tabs
- ion-datetime (bedtime and wake time pickers): https://ionicframework.com/docs/api/datetime
- ion-modal (sheet modal for editing): https://ionicframework.com/docs/api/modal
- ion-item-sliding (swipe to edit or delete): https://ionicframework.com/docs/api/item-sliding
- ion-toast (Undo after delete): https://ionicframework.com/docs/api/toast
- ion-alert (asking before replacing a night): https://ionicframework.com/docs/api/alert
- Ionicons: https://ionic.io/ionicons
- Ionic Storage: https://github.com/ionic-team/ionic-storage
- Angular control flow (@if / @for): https://angular.dev/guide/templates/control-flow
- RxJS Subject (refreshing pages when data changes): https://rxjs.dev/guide/subject
- Capacitor Local Notifications: https://capacitorjs.com/docs/apis/local-notifications
- Capacitor iOS setup: https://capacitorjs.com/docs/ios
- Ionic iOS development guide: https://ionicframework.com/docs/developing/ios
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/designing-for-ios
- Stanford Sleepiness Scale: https://www.med.upenn.edu/cbti/assets/user-content/documents/Stanford%20Sleepiness%20Scale.pdf

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

We worked as a pair and split the work evenly. Tracy built the tabs, the two logging pages, the data classes, storage, sample data and the Today page. Stella built History (chart, averages, edit, delete and undo) and the reminder notifications. We did the final polish, testing and demo together.

5. Is there anything special we need to know in order to run your code?

In the sleeptracker folder, run npm install and then ionic serve. The app adds about two weeks of sample data the first time it opens. Notifications only work in the native app: run npm run build, npx cap sync ios and npx cap open ios, run it on the simulator or an iPhone, and allow notifications when you save a reminder.

--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

College students like us, who go to bed at different times every night and get sleepy at random points in the day. Logging has to take a few seconds or they won't keep doing it.

7. Did you design your app specifically for iOS or Android, or both?

It runs on both because it uses Ionic components, but we followed iOS conventions first: tabs at the bottom, edit forms that slide up as sheets, and swipe to edit or delete.

8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

On the Sleep tab, bedtime and wake time start at 11 PM and 7 AM, so most mornings you only adjust them a little and tap Save; quality and notes are optional. We expect people to log the morning after, and the page won't save a wake time that is before bedtime or in the future.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

The Sleepiness tab lists all seven Stanford Sleepiness Scale levels with their full descriptions, so you tap the one that fits and hit Save, with an optional tag like "After coffee" and notes. Seeing every description at once means you don't have to remember what each number means.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

The History tab has a 7-day sleep chart and averages at the top, and below that every entry grouped by day. Putting a night next to that day's check-ins makes it easy to see whether a short night led to a sleepy day.

11. Which feature did you choose--using a native device resource, backing up logged data, or both?

Both.

12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

You can set up to five daily reminders from the bell icon on History, and tapping the notification opens the Sleepiness page. People forget to check in during the day, so the reminder does the remembering for them.

13. If you backed up logged data, where does it back up to?

Both kinds of records are saved with Ionic Storage, which uses IndexedDB in the browser and the device's local storage in the native app. Entries are still there after a reload or after closing the app.

14. How does your app implement or follow principles of good mobile design?

The Today tab is a useful first screen, the Sleep form blocks impossible times and asks before replacing a night you already logged, and deleting anything shows an Undo button (the "uh-oh" button from lecture). Save buttons stay at the bottom of the screen where your thumb is.

--Demo video timestamps (demo.mp4)--

Recorded on the iOS Simulator (iPhone 16 Pro, iOS 18.3). The time-picker part is sped up 2x and the wait for the notification is cut.

[00:00] Today page
[00:14] Log overnight sleep (a wrong AM/PM shows the 14-hour warning)
[00:51] Log sleepiness with a tag
[01:20] History: 7-day chart, averages, entries by day
[01:28] Set a daily reminder and allow notifications
[02:03] The notification arrives; tapping it opens Sleepiness
[02:17] Quit and reopen the app; the data is still there
