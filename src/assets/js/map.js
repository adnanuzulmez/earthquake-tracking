import axios from "axios";
import apitools from "./api"
import moment from "moment"
const mapMixin = {
    methods: {
        getMap() {
            this.mapCreator = apitools.MAP_API
        },
        async getEarthquakeDatas(date) {
            let earthquakeResults = []
            let config = ""
            if (date != undefined) {
                config = {
                    params: {
                        limit: 1000,
                        date_end: date[1],
                        date: date[0],
                        skip: this.skip
                    }
                }
                let earthquakeDatas = await axios.get(apitools.ARCHIVE_EARTHQUAKES, config)
                earthquakeResults = await earthquakeDatas.data

                let skipCount = earthquakeResults.metadata.total / 1000
                this.skip = skipCount
                earthquakeResults = []
                if (this.skip > 0) {
                    
                    for (let i = 0; i < this.skip; i++) {

                        config = {
                            params: {
                                limit: 1000,
                                date_end: date[1],
                                date: date[0],
                                skip: 1000 * i
                            }
                        }
                        let earthquakeDatas = await axios.get(apitools.ARCHIVE_EARTHQUAKES, config)
                        earthquakeResults =  [...earthquakeResults, earthquakeDatas.data]
                        
                    }
                    console.log(earthquakeResults);
                }
                
            }
            else {
                let earthquakeDatas = await axios.get(apitools.EARTHQUAKE_API)
                earthquakeResults = await earthquakeDatas.data
            }


            return earthquakeResults
        },
        createMarkerDatas() {
            this.getDetailData = []
            this.searchArray = []
            this.position = []
            this.getEAdatas.then((res) => {
                this.getDetailData[0] = res.result
                this.searchArray[0] =  res.result
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
                            },
                            tooltip: item.title,
                            id: item._id
                        })
                    this.getHeatMapDatas.push({ lat: item.geojson.coordinates[1], lng: item.geojson.coordinates[0] })
                    this.dateDay.push(
                        {
                            date: moment(item.date_time).format('dddd'),
                            time: moment(item.date_time).format('HH:mm'),
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
            skip: 0,
            tempEAdatas: [],
        }
    }
}
export default mapMixin