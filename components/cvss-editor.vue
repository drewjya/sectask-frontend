<script lang="ts" setup>

const store = findingStore()

const low = {
  label: "Low (L)",
  value: "L"
}

const high = {
  label: "High (H)",
  value: "H"
}

const network = {
  label: "Network (N)",
  value: "N"
}

const none = {
  label: "None (N)",
  value: "N"
}

const adjacent = {
  label: "Adjacent (A)",
  value: "A"
}

const local = {
  label: "Local (L)",
  value: "L"
}

const physical = {
  label: "Physical (P)",
  value: "P"
}
const present = {
  label: "Present (P)",
  value: "P"
}

const passive = {
  label: "Passive (P)",
  value: "P"
}

const active = {
  label: "Active (A)",
  value: "A"
}

const notdefined = {
  label: "Not Defined (X)",
  value: "X"
}

const negligible = {
  label: "Negligible (N)",
  value: "N"
}

const no = {
  label: "No (N)",
  value: "N"
}

const yes = {
  label: "Yes (Y)",
  value: "Y"
}

const automatic = {
  label: "Automatic (A)",
  value: "A",
}

const user = {
  label: "User (U)",
  value: "U",
}

const irrecovable = {
  label: "Irrecovable (I)",
  value: "I",
}

const difuse = {
  label: "Difuse (D)",
  value: "D",
}

const concentrated = {
  label: "Concentrated (C)",
  value: "C",
}

const moderate = {
  label: "Moderate (M)",
  value: "M",
}

const clear = {
  label: "Clear",
  value: "Clear",
}

const green = {
  label: "Green",
  value: "Green",
}
const amber = {
  label: "Amber",
  value: "Amber",
}
const red = {
  label: "Red",
  value: "Red",
}

const empty = {
  label: "",
  value: "",
}

const safety = {
  label: "Safety (S)",
  value: "S",
}


const threatMetrics = [notdefined, {
  label: "Attacked (A)",
  value: "A"
}, {
    label: "POC (P)",
    value: "P"
  }, {
    label: "Unreported (U)",
    value: "U"
  },]

const cia = [high, low, none]

const ncia = [notdefined, high, low, none]
const app = useApp()
const newC = computed(() => app.sidebar ? 'w-[calc(100vw-40rem)]' : 'w-[calc(100vw-22rem)]')
</script>

<template>

  <div class="flex flex-col gap-4 " v-if="store.cvss">
    <div class="flex flex-col gap-2  " :class="newC">
      <CvssTitle title="Base Metrics" type="supplier" />
      <div class="cvsscontainer">
        <div class="subtitle">Expoloitability Metrics</div>
        <div class="cvssscroll">
          <CvssValue label="Attack Vector (AV)" :items="[network, adjacent, low, physical]" :selected="store.cvss?.AV"
            @select="(val) => {
              if (!store.cvss) {
                return;
              }
              store.cvss = {
                ...store.cvss,
                AV: val.value
              }
            }" />
          <CvssValue label="Attack Complexity (AC)" :items="[low, high]" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              AC: val.value
            }
          }" :selected="store.cvss.AC" />
          <CvssValue label="Attack Requirements (AT)" :items="[none, present]" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              AT: val.value
            }
          }" :selected="store.cvss.AT" />
          <CvssValue label="Privileges Required (PR)" :items="[none, low, high]" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              PR: val.value
            }
          }" :selected="store.cvss.PR" />
          <CvssValue label="User Interaction (UI)" :items="[none, passive, active]" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              UI: val.value
            }
          }" :selected="store.cvss.UI" />
        </div>
      </div>
      <div class="cvsscontainer">
        <div class="subtitle">Vulnerable System Impact Metrics</div>
        <div class="cvssscroll">
          <CvssValue label="Confidentiality (VC)" :items="cia" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              VC: val.value
            }
          }" :selected="store.cvss.VC" />
          <CvssValue label="Integrity (VI)" :items="cia" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              VI: val.value
            }
          }" :selected="store.cvss.VI" />
          <CvssValue label="Availability (VA)" :items="cia" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              VA: val.value
            }
          }" :selected="store.cvss.VA" />
        </div>
      </div>
      <div class="cvsscontainer">
        <div class="subtitle">Subsequent System Impact Metrics</div>
        <div class="cvssscroll">
          <CvssValue label="Confidentiality (SC)" :items="cia" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              SC: val.value
            }
          }" :selected="store.cvss.SC" />
          <CvssValue label="Integrity (SI)" :items="cia" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              SI: val.value
            }
          }" :selected="store.cvss.SI" />
          <CvssValue label="Availability (SA)" :items="cia" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              SA: val.value
            }
          }" :selected="store.cvss.SA" />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2" :class="newC">
      <CvssTitle title="Supplemental Metrics" type="supplier" />
      <div class="cvsscontainer">
        <div class="cvssscroll">
          <CvssValue label="Safety (S)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              S: val.value
            }
          }" :selected="store.cvss.S" :items="[notdefined, negligible, present]" />
          <CvssValue label="Automatable (AU)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              AU: val.value
            }
          }" :selected="store.cvss.AU" :items="[notdefined, no, yes]" />
          <CvssValue label="Recovery (R)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              R: val.value
            }
          }" :selected="store.cvss.R" :items="[notdefined, automatic, user, irrecovable]" />
          <CvssValue label="Value Density (V)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              V: val.value
            }
          }" :selected="store.cvss.V" :items="[notdefined, difuse, concentrated]" />
          <CvssValue label="Vulnerability Response Effort (RE)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              RE: val.value
            }
          }" :selected="store.cvss.RE" :items="[notdefined, low, moderate, high]" />
          <CvssValue label="Provider Urgency (U)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              U: val.value
            }
          }" :selected="store.cvss.U" :items="[notdefined, clear, green, amber, red]" />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2" :class="newC">
      <CvssTitle title="Environmental (Modified Base Metrics)" type="consumer" />
      <div class="cvsscontainer">
        <div class="subtitle">Expoloitability Metrics</div>
        <div class="cvssscroll">
          <CvssValue label="Attack Vector (MAV)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MAV: val.value
            }
          }" :selected="store.cvss.MAV" :items="[notdefined, network, adjacent, local, physical]" />
          <CvssValue label="Attack Complexity (MAC)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MAC: val.value
            }
          }" :selected="store.cvss.MAC" :items="[notdefined, low, high]" />
          <CvssValue label="Attack Requirements (MAT)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MAT: val.value
            }
          }" :selected="store.cvss.MAT" :items="[notdefined, none, present]" />
          <CvssValue label="Privileges Requirements (MPR)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MPR: val.value
            }
          }" :selected="store.cvss.MPR" :items="[notdefined, none, low, high]" />
          <CvssValue label="User Interaction (MUI)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MUI: val.value
            }
          }" :selected="store.cvss.MUI" :items="[notdefined, none, passive, active]" />
        </div>
      </div>
      <div class="cvsscontainer">
        <div class="subtitle">Vulnerable System Impact Metrics</div>
        <div class="cvssscroll">
          <CvssValue label="Confidentiality (MVC)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MVC: val.value
            }
          }" :selected="store.cvss.MVC" :items="ncia" />
          <CvssValue label="Integrity (MVI)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MVI: val.value
            }
          }" :selected="store.cvss.MVI" :items="ncia" />
          <CvssValue label="Availability (MVA)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MVA: val.value
            }
          }" :selected="store.cvss.MVA" :items="ncia" />
        </div>
      </div>
      <div class="cvsscontainer">
        <div class="subtitle">Subsequent System Impact Metrics</div>
        <div class="cvssscroll">
          <CvssValue label="Confidentiality (MSC)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MSC: val.value
            }
          }" :selected="store.cvss.MSC" :items="[notdefined, empty, high, low, negligible]" />
          <CvssValue label="Integrity (MSI)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MSI: val.value
            }
          }" :selected="store.cvss.MSI" :items="[notdefined, safety, high, low, negligible]" />
          <CvssValue label="Availability (MSA)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              MSA: val.value
            }
          }" :selected="store.cvss.MSA" :items="[notdefined, safety, high, low, negligible]" />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2" :class="newC">
      <CvssTitle title="Environmental (Security Requirements)" type="consumer" />
      <div class="cvsscontainer">
        <div class="cvssscroll">
          <CvssValue label="Confidentiality (CR)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              CR: val.value
            }
          }" :selected="store.cvss.CR" :items="ncia" />
          <CvssValue label="Integrity (IR)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              IR: val.value
            }
          }" :selected="store.cvss.IR" :items="ncia" />
          <CvssValue label="Availability (AR)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              AR: val.value
            }
          }" :selected="store.cvss.AR" :items="ncia" />
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2" :class="newC">
      <CvssTitle title="Threat Metrics" type="consumer" />
      <div class="cvsscontainer">
        <div class="cvssscroll">
          <CvssValue label="Exploit Maturity (E)" @select="(val) => {
            if (!store.cvss) {
              return;
            }
            store.cvss = {
              ...store.cvss,
              E: val.value
            }
          }" :selected="store.cvss.E" :items="threatMetrics" />
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.cvsscontainer {
  @apply w-full bg-gray-200 rounded-md p-2
}

.cvssscroll {
  @apply flex flex-col gap-2 w-full overflow-x-auto
}

.subtitle {
  @apply text-[0.9rem] text-center font-semibold
}
</style>
