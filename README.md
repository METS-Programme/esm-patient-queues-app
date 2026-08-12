# Service Queues

The `Service Queues` app is a frontend module that enables users to track a patient's progress as they move through a clinic. Users can see an overview of various clinic metrics such as:

- The number of active visits.
- The number of patients waiting for a particular service.
- The average number of minutes spent by patients waiting for a service.

The key component of the service queue app is the `Active Visits` table. It displays a tabular overview of the active visits ongoing in a facility and the wait time of patients. Users can add patients to the service queue by starting visits for them. They can also view information from the current active visits as well as the previous visit on each queue entry by clicking the table extension slot. Users can also change the priority and status of an entry in the queue from the UI, effectively moving a patient from one point in the queue to another. In order to indicate that a patient is currently attending service, click on the bell icon. In order to edit an entry, click the pencil icon. 

Configure the following values before using the module:

- `triageRoomTag` — location tag UUID used to identify triage queue rooms.
- `clinicalRoomTag` — location tag UUID used to identify clinical queue rooms.
- `showExtraVisitAttributesSlot` — enables submission of visit attributes supplied by the
  `extra-visit-attribute-slot` extension.

After configuring the concepts, add the services according to the facility setup by clicking the `Add new service` button.

In order to configure rooms that provide different services, click the `Add new room` button. To view patients attending service in different rooms, click the `Queue screen` button.

You should now be able to leverage the service queues module 🎉

## Development

This project uses Node.js 20 and Yarn 4.

```sh
corepack enable
yarn install --immutable
yarn start
```

Quality checks:

```sh
yarn lint
yarn typescript
yarn test
yarn build
```

`yarn lint` is read-only. Use `yarn lint:fix` when you explicitly want ESLint to modify files.

The queue board refreshes active queue data every 15 seconds while the page is visible and
online. Patient-list search is sent to the server after a short debounce, and pagination is
handled by the REST endpoint using `startIndex`, `limit`, and `totalCount`.

The application requires the OpenMRS FHIR2 module version 1.2 or newer and REST Web Services
version 2.24.0 or newer, as declared in `src/routes.json`. Queue and queue-statistics endpoints
must also be supplied by the UgandaEMR backend distribution.
