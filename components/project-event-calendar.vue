<script setup lang="ts">
import {
  createCalendar,
  viewMonthAgenda,
  viewMonthGrid,
  viewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import { ScheduleXCalendar } from "@schedule-x/vue";
import dayjs from "dayjs";

const app = useApp();
const store = projectStore(app.user?.id ?? -1)();

const eventsServicePlugin = createEventsServicePlugin();
// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin
const calendarApp = createCalendar({
  views: [viewMonthGrid, viewMonthAgenda],
  plugins: [eventsServicePlugin],
  defaultView: viewWeek.name,
  isDark: false,
  calendars: calendarConfig,
});

onMounted(async () => {
  const keys = Object.keys(calendarConfig);
  const configLength = keys.length;
  await setTimeout(() => {
    const events =
      store.subprojects?.map((i, index) => {
        return {
          id: i.id,
          title: i.name,
          start: dayjs(i.startDate).format("YYYY-MM-DD"),
          end: dayjs(i.endDate).format("YYYY-MM-DD"),
          calendarId: keys[index % configLength],
        };
      }) ?? [];
    console.log(events);
    events.forEach((e) => {
      eventsServicePlugin.add(e);
      console.log(eventsServicePlugin.getAll());
    });
  }, 500);
});

const data = computed(() => store.subprojects ?? []);
watch(data, async (val) => {
  console.log("EV AS ", val);
  const keys = Object.keys(calendarConfig);
  const configLength = keys.length;
  try {
    const ids = val.map((e) => e.id);
    const { remove, present } = eventsServicePlugin.getAll().reduce(
      (a, b) => {
        let rem = a.remove;
        let pres = a.present;
        if (ids.includes(Number(b.id))) {
          pres = [...pres, Number(b.id)];
        } else {
          rem = [...rem, Number(b.id)];
        }
        return {
          remove: [...rem],
          present: [...pres],
        };
      },
      {
        remove: <number[]>[],
        present: <number[]>[],
      }
    );
    // const isPresent = eve;
    console.log(remove, "remove");
    console.log(present, "present");
    console.log(ids, "id");
    const newVal = val.filter((e) => {
      return !present.includes(e.id);
    });
    remove.forEach((e) => {
      eventsServicePlugin.remove(e);
    });

    console.log(newVal, "New Val");

    await setTimeout(() => {
      const events =
        newVal.map((i, index) => {
          return {
            id: i.id,
            title: i.name,
            start: dayjs(i.startDate).format("YYYY-MM-DD"),
            end: dayjs(i.endDate).format("YYYY-MM-DD"),
            calendarId: keys[Date.now() % configLength],
          };
        }) ?? [];

      events.forEach((e) => {
        eventsServicePlugin.add(e);
        console.log(eventsServicePlugin.getAll(), "NEw Er");
      });
    }, 500);
  } catch (error) {
    console.log("ERROR CYUY", error);
  }
});
</script>

<template>
  <div>
    <ScheduleXCalendar :calendar-app="calendarApp" />
  </div>
</template>
<style scoped></style>
