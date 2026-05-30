# JClock

JClock is a Jerusalem-based Hebrew clock and calendar site. It presents Hebrew
time, calendar information, schedules, and related tools in one Firebase-hosted
static site.

By default, JClock is centered on Jerusalem. Users can also choose or allow their
current location so the clock and time-based calculations reflect where they
are.

The main JClock page combines the Hebrew clock display with the commercial and
schedule views used by the site.

The project is shared so people can use, study, and preserve the Hebrew time and
calendar information it contains.

## About the Project

HebrewCommercial13 is a modified and improved version of the SunCalc library,
designed to calculate solar and lunar positions and times. This project focuses
on bug fixes and enhancements to better serve developers and communities relying
on precise astronomical calculations.

## Motivation

This project was improved to honor the connection between technology and
spiritual wisdom. I aim to share tools that help the community while reflecting
the values of innovation and divine guidance.

## Key Features

- Accurate solar and lunar position calculations.
- Bug fixes and optimizations to the original SunCalc library.
- Support for additional use cases and configurations.

## Acknowledgments

This project is based on the original [SunCalc](https://github.com/mourner/suncalc)
library by Vladimir Agafonkin, licensed under the BSD-2-Clause License. All
modifications and improvements were made by Naftali Bilig.

## Live Pages

- Main site: https://JClock.net
- Hebrew clock view: https://JClock.net/HebrewClock13/public/family
- Commercial display view: https://JClock.net/HebrewCommercial13/public/family
- Hebrew schedule: https://JClock.net/HebrewSchedule13/public

## Project Structure

- `public/` - Firebase Hosting root.
- `public/index.html` - Main JClock page.
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

This project is licensed under the BSD-2-Clause License. See the [LICENSE](LICENSE)
file for details.

BSD 2-Clause keeps the code open and easy to reuse while requiring preservation
of the copyright notice and license terms.

Third-party libraries, logos, images, and other externally sourced assets remain
under their own licenses or usage terms where applicable.


