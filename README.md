# JClock

JClock is a Firebase-hosted collection of Hebrew clock, schedule, and related
calendar tools. The public site combines HebrewClock13 with HebrewCommercial13
and includes additional static pages such as schedules and mahasrot pages.

By default, JClock is centered on Jerusalem. Users can also choose or allow their
current location so the clock and time-based calculations can reflect where they
are.

The project is shared so people can use, study, and preserve the Hebrew time and
calendar information it contains.

## Live Pages

- Main site: https://jclock126.web.app
- HebrewClock13 family view: https://jclock126.web.app/HebrewClock13/public/family
- HebrewCommercial13 family view: https://jclock126.web.app/HebrewCommercial13/public/family
- Hebrew schedule: https://jclock126.web.app/HebrewSchedule13/public

## Project Structure

- `public/` - Firebase Hosting root.
- `public/index.html` - Main JClock page that embeds HebrewClock13 and HebrewCommercial13.
- `public/HebrewClock13/` - Hebrew clock pages and assets.
- `public/HebrewCommercial13/` - Hebrew commercial display subproject.
- `public/HebrewSchedule13/` - Hebrew schedule pages.
- `temp_public/` - Temporary/static pages that are not the active Firebase Hosting root.
- `firebase.json` - Firebase Hosting configuration.
- `apphosting.yaml` - Firebase App Hosting/Cloud Run settings.

## Local Use

This is a static site. To preview it locally, serve the repository's `public`
directory with any static file server, then open the local URL in a browser.

For example:

```sh
firebase emulators:start --only hosting
```

or:

```sh
npx serve public
```

## Deployment

Firebase Hosting is configured to publish the `public` directory:

```sh
firebase deploy --only hosting
```

## License

The source code and original project materials are licensed under the BSD
2-Clause License. See [LICENSE](LICENSE).

BSD 2-Clause keeps the code open and easy to reuse while requiring preservation
of the copyright notice and license terms.

Third-party libraries, logos, images, and other externally sourced assets remain
under their own licenses or usage terms where applicable.


