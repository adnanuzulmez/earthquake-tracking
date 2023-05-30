<template>
  <div id="app">

    <div class="leftSidebar" :class="[sidebarFlag === 0 ? 'sidebarHidden' : '']">
      <div id="sideBar" ref="contentBox">
        <div class="searchBar">
          <input type="text" placeholder="Search" v-model="citySearch">
        </div>
        <div v-for="(item, index) in searchArray" :key="index">
          <div class="locationData" v-for="(item, index) in item" :key="index"
            :class="[(index === 0 && citySearch === '' && magValue === '') ? 'lastLocation' : '', selectedMarker === index ? 'selected' : '']"
            @click="setCenterByLocation(item._id, index), selectAndScroll(index)" ref="choosenLocation">
            <div class="headInfo">
              <h3 class="locationNumber magSize" style=" cursor: pointer;">
                {{ item.mag }}</h3>
              <h4>●</h4>
              <h3 class="locationNumber fw-300" style=" cursor: pointer;">
                {{ item.depth }} KM</h3>
              <h4>●</h4>
              <h3 class="locationNumber fw-300" style=" cursor: pointer;">
                {{ dateDay[index].date }} {{ dateDay[index].time }}</h3>
            </div>
            <div>
              <div class="lastLocationData">
                <p class="locationAddress" style=" cursor: pointer;">
                  {{ item.title }}
                </p>
                <p class="lastTitle" v-if="index === 0 && citySearch === '' && magValue === ''">Last</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="filterButtons">
        <div class="sidebarSwitch" @click="sidebarHide()" :class="[sidebarFlag === 0 ? 'sidebarSwitchStatus' : '']">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ul"
            viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
        </div>
        <div class="sidebarSwitch" @click.self="calendarShow()">
          <div class="hideContent" :class="[dateFlag === 0 ? 'hideContent-show' : '']">
            <date-picker v-model="dateRange" range :disabled-date="(date) => date >= new Date()"></date-picker>
          </div>
          <svg @click="calendarShow()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-calendar-date" viewBox="0 0 16 16" style=" width: 20px;height: 20px;">
            <path
              d="M6.445 11.688V6.354h-.633A12.6 12.6 0 0 0 4.5 7.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z" />
            <path
              d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
          </svg>
        </div>
        <div class="sidebarSwitch" @click.self="filterShow()">
          <div class="hideContent" :class="[filterFlag === 0 ? 'hideContent-show' : '']">
            <div class="magnitudeFilter">
              <multiselect v-model="magValue" :options="magOptions" :searchable="false" :close-on-select="true"
                :show-labels="false" placeholder="Select Magnitude"></multiselect>
            </div>
          </div>
          <svg @click="filterShow()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-filter" viewBox="0 0 16 16">
            <path
              d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
          </svg>
        </div>

      </div>
    </div>
    <div id="mapBox">
      <l-map :zoom="zoom" :center="center" :min-zoom="minZoom" :max-zoom="maxZoom" ref="map">
        <l-tile-layer :url="this.mapCreator" :attribution="attribution" />
        <Vue2LeafletHeatmap :lat-lng="getHeatMapDatas" :radius="40" :min-opacity="0.35" :max-zoom="10" :blur="50">
        </Vue2LeafletHeatmap>
        <l-marker v-for="(item, index) in position" :key="index" :lat-lng="item.position" @click="getWeatherData(index), () => {
            selectAndScroll(index)

            center = [item.position.lat, item.position.lng]}">
          <l-popup style="min-width: 150px">

            <div class="magnitude">
              <h2 style="font-size: 40px;color: #446c8f;;">{{ item.popup.mag }}</h2>
              <h4>Magnitude</h4>
            </div>
            <div class="infos">
              
              <h5>{{ dateDay[index].date }} {{ dateDay[index].time }}</h5>
              <h5>Depth: {{ item.popup.depth }} KM</h5>
              <h5>{{ dateDay[index].title }} </h5>
              <h5 style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex;  justify-content: center; flex-direction: column;">
                  <h3>{{ forecastInfo.condition.text }}</h3>
                <h3>{{ forecastInfo.mintemp_c }}°  -  {{ forecastInfo.maxtemp_c }}°</h3>
                </div>
              <img :src="forecastInfo.condition.icon" style="width: 50px; height: 50px">
              </h5>
             
            </div>
          </l-popup>
          <l-icon>
            <div :id="item.id" :class="[`mag-${parseInt(item.popup.mag)}`, index === 0 ? 'lastEarthQuake' : '']"></div>
          </l-icon>
          <l-tooltip :content="item.tooltip">
          </l-tooltip>
        </l-marker>
        <l-icon-default :image-path="path" />
        
          <l-polyline  :lat-lngs="staticFaultLine" :visible="true" :options="{color: 'red', weight: 6, opacity: 0.4}" />
       
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker, LIconDefault, LPopup, LIcon, LTooltip, LPolyline, } from "vue2-leaflet";
import mapMixin from "./assets/js/map.js"
import Vue2LeafletHeatmap from "./Vue2LeafletHeatMap";
import Multiselect from 'vue-multiselect'
import moment from "moment"
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import apitools from "./assets/js/api"
import axios from 'axios'
import faultLine from './assets/static-data/fault-lines'
let cityId
export default {
  name: "EarthquakeMap",
  mixins: [mapMixin],
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIconDefault,
    LPopup,
    Vue2LeafletHeatmap,
    LIcon,
    LTooltip,
    Multiselect,
    DatePicker,
    LPolyline,
  },
  data() {
    return {
      zoom: 4,
      minZoom: 3,
      maxZoom: 15,
      path: "/images/",
      center: [38.837033, 35.057786],
      popupOpen: "",
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      citySearch: '',
      searchArray: [],
      sidebarFlag: 1,
      magOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      magValue: "",
      filterFlag: 1,
      dateFlag: 1,
      dateRange: [],
      selectedMarker: '',
      forecastInfo: {
        condition: {
          text: '',
          icon: '',
        },
        mintemp_c: '',
        maxtemp_c: ''
      },
      faultLines: [],
      staticFaultLine:[],
      staticFaultLine2:[],
    };
  },
  mounted() {
    this.faultLines = faultLine
    this.faultLineCreator()
    this.getMap()
    console.log(this.getEAdatas);
    this.getEAdatas = this.getEarthquakeDatas()
    setTimeout(() => {
      this.createHeatMapDatas()
      this.createMarkerDatas()
    }, 400);
    setTimeout(() => {
      this.$refs.map.mapObject.setZoom(5)
    }, 200);
    let leafletZoom = document.querySelector(".leaflet-left")
    leafletZoom.remove()
    
  },
  watch: {
    citySearch() {
      this.filterCity()
    },
    magValue() {
      this.filterMag()
    },
    dateRange() {
      this.dateRange[0] = moment(this.dateRange[0]).format("YYYY-MM-DD")
      this.dateRange[1] = moment(this.dateRange[1]).format("YYYY-MM-DD")
      this.getEAdatas = this.getEarthquakeDatas(this.dateRange)
      this.searchArray = []
      this.getDetailData = []
      this.position = []
      this.getHeatMapDatas = []
      this.dateDay = []
      this.getEAdatas.then((res) => {

        res.map((items, index) => {

          items.result.map((item) => {
            this.getDetailData[index] = items.result
            this.searchArray[index] = items.result
            this.position.push(
              {
                position: {
                  lat: item.geojson.coordinates[1],
                  lng: item.geojson.coordinates[0]
                },
                popup: {
                  mag: item.mag,
                  depth: item.depth,
                },
                tooltip: item.title,
                id: item._id
              })
            this.getHeatMapDatas.push({ lat: item.geojson.coordinates[1], lng: item.geojson.coordinates[0] })
            this.dateDay.push(
              {
                fullDate: moment(item.date_time).format('YYYY-MM-DD'),
                date: moment(item.date_time).format('dddd'),
                time: moment(item.date_time).format('HH:mm'),
                title: item.title
              })
          })

        })
        console.log(this.searchArray);
      })


    }

  },
  methods: {
    faultLineCreator() {
     
      this.faultLines.features.map((item, index) => {
        this.staticFaultLine2[index] = item.geometry.coordinates
      })
      this.staticFaultLine2.map((item, index) => {
        let tempFault = []
        item.map((items) => {
          tempFault.push(items.reverse())
        })
        this.staticFaultLine[index] = tempFault
      })
      
    },
    sidebarHide() {
      if (this.sidebarFlag != 0) {
        this.sidebarFlag = 0
      }
      else {
        this.sidebarFlag = 1
      }
    },
    filterMag() {
      this.getDetailData.map((item, index) => {
        this.searchArray[index] = this.getDetailData[index]
        this.searchArray[index] = this.searchArray[index].filter(item => parseInt(item.mag) >= parseInt(this.magValue))
      })

      let tempPosition = []
      this.position = []
      this.getHeatMapDatas = []
      this.dateDay = []
      this.searchArray.map((item, index) => {
        tempPosition[index] = item.filter(item => parseInt(item.mag) >= parseInt(this.magValue))
      })

      tempPosition.map((items) => {
        items.map((item) => {
          this.position.push(
            {
              position: {
                lat: item.geojson.coordinates[1],
                lng: item.geojson.coordinates[0]
              },
              popup: {
                mag: item.mag,
                depth: item.depth,
              },
              tooltip: item.title,
              id: item._id
            })
          this.getHeatMapDatas.push({ lat: item.geojson.coordinates[1], lng: item.geojson.coordinates[0] })
          this.dateDay.push(
            {
              fullDate: moment(item.date_time).format('YYYY-MM-DD'),
              date: moment(item.date_time).format('dddd'),
              time: moment(item.date_time).format('HH:mm'),
              title: item.title
            })
        })

      })
    },
    filterCity() {

      this.getDetailData.map((item, index) => {
        this.searchArray[index] = this.getDetailData[index]
        this.searchArray[index] = this.searchArray[index].filter(item => item.title.toLowerCase().includes(this.citySearch.toLowerCase()))
      })
      let tempLoc = []
      this.position = []
      this.getHeatMapDatas = []
      this.dateDay = []
      this.searchArray.map((item, index) => {
        tempLoc[index] = item.filter(item => item.title.toLowerCase().includes(this.citySearch.toLowerCase()))
      })

      tempLoc.map((items) => {
        items.map((item) => {
          this.position.push(
            {
              position: {
                lat: item.geojson.coordinates[1],
                lng: item.geojson.coordinates[0]
              },
              popup: {
                mag: item.mag,
                depth: item.depth,
              },
              tooltip: item.title,
              id: item._id
            })
          this.getHeatMapDatas.push({ lat: item.geojson.coordinates[1], lng: item.geojson.coordinates[0] })
          this.dateDay.push(
            {
              fullDate: moment(item.date_time).format('YYYY-MM-DD'),
              date: moment(item.date_time).format('dddd'),
              time: moment(item.date_time).format('HH:mm'),
              title: item.title
            })
        })

      })
    },
    filterShow() {
      if (this.filterFlag != 0) {
        this.filterFlag = 0
      }
      else {
        this.filterFlag = 1
      }
    },
    calendarShow() {
      if (this.dateFlag != 0) {
        this.dateFlag = 0
      }
      else {
        this.dateFlag = 1
      }
    },
    setCenterByLocation(id) {
      cityId = this.getDetailData[0].filter((item) => item._id === id)
      console.log(cityId[0]);
      setTimeout(async () => {
        this.getHeatMapDatas = []
        await this.$refs.map.mapObject.flyTo(cityId[0].geojson.coordinates.reverse(), 13, { duration: 3.2 })
      }, 10);
      setTimeout(() => {
        this.createHeatMapDatas()
      }, 20);
      setTimeout(() => {
        this.x = document.querySelectorAll(`.leaflet-marker-icon`)
        Array.from(this.x).map((item) => {
          if (item.childNodes[0].getAttribute("id") === cityId[0]._id) {
            item.childNodes[0].click()
          }
        })
      }, 3300);
    },

    selectAndScroll(index) {
      const contentBox = this.$refs.contentBox;
      const selectedDivIndex = index
      const selectedDiv = this.$refs.choosenLocation[selectedDivIndex];
      const containerRect = contentBox.getBoundingClientRect();
      const targetDivRect = selectedDiv.getBoundingClientRect();
      const containerScrollTop = contentBox.scrollTop;
      const scrollOffset = targetDivRect.top - containerRect.top + containerScrollTop - containerRect.height / 2 + targetDivRect.height / 2;
      contentBox.scrollTo({ top: scrollOffset, behavior: 'smooth' });
      setTimeout(() => {
        this.selectedMarker = index
      }, 1000);
    },
    getWeatherData(index) {
      let dateTime = this.dateDay[index].fullDate
      let params = {
        params: {
          q: this.dateDay[index].title,
          dt: dateTime
        }
      }
      axios.get(apitools.WEATHER_API, params)
       .then((response) => {
        
        this.forecastInfo = response.data.forecast.forecastday[0].day
        console.log(this.forecastInfo);
      })

        .then((response) => {
          console.log(response.data);
        })

    }
  }

};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

* {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
}

#mapBox {
  height: 100%;
  width: 100%;
  position: absolute;
}

#sideBar {
  min-width: 500px;
  background-color: #3C3D3F;
  height: 100%;
  overflow-y: scroll;
  position: relative;
  right: 0%;
  z-index: 99999999;
  transition: 1.5s;
}

* {
  scrollbar-width: 5px !important;
  scrollbar-color: #5f5f5f #3C3D3F !important;
  scrollbar-face-color: #5c5c5c !important;
  /* Firefox 63 compatibility */
  scrollbar-track-color: #636363 !important;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 10px !important;
}

*::-webkit-scrollbar-track {
  background: #3C3D3F !important;
}

*::-webkit-scrollbar-thumb {
  background-color: #8d8d8d !important;
  border-radius: 15px !important;
  border: 2px solid #3C3D3F !important;
}

.magnitude {
  text-align: center;
  margin-bottom: 15px;
}

.infos h5 {
  padding-bottom: 5px;
}

.mag-1 {
  width: 8px;
  height: 8px;
  background-color: rgb(255, 229, 114);
  border-radius: 50%;
  border: 1px solid #ffb387;
}

.mag-2 {
  width: 10px;
  height: 10px;
  background-color: rgb(255, 160, 72);
  border-radius: 50%;
  border: 1px solid #ffb387;
}

.mag-3 {
  width: 18px;
  height: 18px;
  background-color: rgb(255, 108, 23);
  border-radius: 50%;
  border: 1px solid #ffb387;
}

.mag-4,
.mag-5 {
  width: 24px;
  height: 24px;
  background-color: rgb(253, 84, 84);
  border-radius: 50%;
  border: 1px solid #ffb387;
}

.mag-6,
.mag-7 {
  width: 32px;
  height: 32px;
  background-color: rgb(201, 0, 0);
  border-radius: 50%;
  border: 1px solid #ffb387;
}

.magSize {
  font-size: 25px;
}

.lastLocationData {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.searchBar {
  margin: 32px 30px 23px 25px;
}

.sidebarSwitchStatus {
  margin-left: 20px;
}

.sidebarHidden {
  right: 500px !important;
  transition: 3s;
}

.leftSidebar {
  transition: 1s;
  display: flex;
  position: relative;
  right: 0
}

.sidebarSwitch {

  position: relative;
  color: #dfdfdf;
  margin-left: 20px;
  margin-top: 10px;
  z-index: 9999999;
  padding: 10px;
  border-radius: 50%;
  background: #494c50;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: rgb(173 173 173 / 55%) 0px 0px 7px 6px;
  cursor: pointer;
  height: 28px;
  width: 28px;
}

.sidebarSwitch svg {
  width: 28px;
  height: 28px;
}

.filterButtons {
  display: flex;
  max-width: 140px;
  height: 130px;
  flex-wrap: wrap;
}

.searchBar input {
  width: 100%;
  background-color: transparent;
  outline: none;
  border: none;
  color: #c3c3c3;
  font-size: 16px;
  border-bottom: 1px solid #ffffff00;
  transition: .2s;
}

.searchBar input:focus {
  border-bottom: 1px solid #81a1ff;
  box-shadow: rgb(69 111 173 / 55%) 0px 6px 7px -4px;
}

.searchBar input::placeholder {
  color: #a9a9a9;
}

.lastTitle {
  padding: 3px 14px;
  border: 1px solid #a1a1a1;
  border-radius: 7px;
  box-shadow: rgb(133 133 133 / 55%) 0px 0px 12px;
}

.locationData {
  border: 1px solid rgb(204 204 204 / 11%);
  margin: 10px 25px;
  padding: 12px 19px;
  box-shadow: rgb(0 81 255 / 10%) 0px 0px 20px;
  transition: 0.3s;
  position: relative;
  z-index: 10;
  background-color: #313133ad;
  border-radius: 5px;
  color: #d0d8df;
  cursor: pointer;
}

.fw-300 {
  font-weight: 300;
  font-size: 14px;
}

.headInfo {
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
}

.locationAddress {
  font-size: 13px;
}

.lastLocation {
  box-shadow: rgb(255 255 255 / 55%) 0px 0px 20px;
}

.leaflet-tile-pane {
  filter: brightness(0.6) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
}

.leaflet-popup-content-wrapper {
  border-radius: 3px !important;
}

.leaflet-popup-tip {
  width: 12px !important;
  height: 8px !important;
  padding: 1px !important;
  margin: -6px auto 0px !important;
}

.multiselect__content-wrapper {
  max-height: 150px !important;
}

.multiselect {
  width: 175px;
}

.lastEarthQuake {
  animation: pulse 2s infinite;
}

.hideContent-show {
    left: 55px !important;
    top: 7px !important;
    opacity: 1 !important;
    transition: .6s;
}

.hideContent {
  position: absolute;
    opacity: 0;
    transition: .6s;
    z-index: -1;
    top: -100px;
    left: 55px;
}

.selected {
  background-color: #ffffff80 !important;
  color: #000000 !important;
  box-shadow: rgb(221 221 221 / 39%) 0px 0px 20px !important;
}

.multiselect__option--selected.multiselect__option--highlight {
  background: #ff6a6a00;
  color: #fff;
}

.multiselect__option--highlight {
  background: #ffffff1f;
  color: #fff;
}

.multiselect__option--selected {
  background: #ff6a6a00;
  color: #fff;
}

.multiselect__option {
  color: #fff;
}

.multiselect__tags {
  min-height: 40px;
  display: block;
  padding: 8px 40px 0 8px;
  border-radius: 5px;
  border: 1px solid #525252;
  background: #525252;
  font-size: 14px;
  box-shadow: rgb(173 173 173 / 28%) 0px 0px 7px 6px;
}

.multiselect__single {
  position: relative;
  display: inline-block;
  min-height: 20px;
  line-height: 20px;
  border: none;
  border-radius: 5px;
  background: #525252;
  padding: 0 0 0 5px;
  width: 100%;
  transition: border .1s ease;
  box-sizing: border-box;
  margin-bottom: 8px;
  vertical-align: top;
  color: #fff;
}

.multiselect__content-wrapper {
  position: absolute;
  display: block;
  background: #525252;
  width: 100%;
  max-height: 240px;
  overflow: auto;
  border: none;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 50;
  -webkit-overflow-scrolling: touch;
}

.mx-datepicker-popup {
  left: 644px !important;
}

.mx-datepicker-range {
  width: 220px !important;
}

/*https://api.orhanaydogdu.com.tr/deprem/kandilli/archive?limit=1000&date_end=2023-04-28&date=2023-04-01&skip=5000*/

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 3px rgb(255, 255, 255);
  }

  70% {
    transform: scale(1.2);
    box-shadow: 0 0 0 15px rgba(255, 255, 255, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}
</style>