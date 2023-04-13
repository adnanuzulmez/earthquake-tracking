
import axios from "axios";
import apitools from "./api"
import moment from "moment"
const mapMixin = {
    methods: {
        getMap() {
            this.mapCreator = apitools.MAP_API
        },
        async getEarthquakeDatas() {
            let earthquakeDatas = await axios.get(apitools.EARTHQUAKE_API)
            let earthquakeResults = await earthquakeDatas.data
            return earthquakeResults
        },
        createMarkerDatas() {
            this.getEAdatas.then((res) => {
                this.getDetailData[0] = res.result

                res.result.map((item) => {

                    this.position.push(
                        {
                            position: {
                                lat: item.geojson.coordinates[1],
                                lng: item.geojson.coordinates[0]
                            }, 
                            popup: {
                                mag: item.mag,
                                depth: item.depth,
                            }
                        })
                    this.getHeatMapDatas.push({ lat: item.geojson.coordinates[1], lng: item.geojson.coordinates[0] })
                    this.dateDay.push(
                        {
                            date: moment(item.date_time).format('dddd'),
                            time: moment(item.date_time).format('HH:MM'),
                            title: item.title
                        })

                })
            })
        },
        createHeatMapDatas() {
            this.position.map((item) => {
                this.getHeatMapDatas.push(item.position)
            })
        },

    },
    mounted() {
        this.getMap()
        this.getEarthquakeDatas()
    },
    data() {
        return {
            mapCreator: null,
            earthquakeDatas: {},
            earthquakeResults: [],
            position: [],
            getEAdatas: [],
            getHeatMapDatas: [],
            getDetailData: [],
            dateDay: [],
        }
    }
}
export default mapMixin