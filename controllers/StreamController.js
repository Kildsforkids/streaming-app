import google from 'googleapis'
import opn from 'open'
import StreamModel from '../models/Stream.js'

export default class StreamController {

    constructor() {
        this.client = {}
        this.oauth2Client = {}
        this.youtube = {}
    }

    // constructor(client) {
    //     this.client = client
    //     this.oauth2Client = new google.Auth.OAuth2Client(client.id, client.secret, client.redirect_url)
    //     this.youtube = new google.youtube_v3.Youtube({ auth: this.oauth2Client })
    // }

    setClient(client) {
        this.client = client
        this.oauth2Client = new google.Auth.OAuth2Client(client.id, client.secret, client.redirect_url)
        this.youtube = new google.youtube_v3.Youtube({ auth: this.oauth2Client })
    }

    googleAuth() {
        const url = this.oauth2Client.generateAuthUrl({ scope: this.client.scope })
        opn(url)
    }

    getAccessToken(code) {
        this.oauth2Client.getToken(code, (err, tokens) => {
            if (err) {
                console.log('Error while trying to retrieve access token', err)
                return
            }
            this.oauth2Client.credentials = tokens
            // console.log(tokens)
            // const scheduledStartTime = new Date(2021, 4, 25, 17, 30)
            // insertLiveBroadcast('Testing app', scheduledStartTime)
            //     .then(response => {
            //         console.log('Response', response.data)
            //         insertLiveStream('TestStream')
            //             .then(res => {
            //                 console.log('Stream Response', res.data)
            //                 bindLiveBroadcast(response.data.id, res.data.id)
            //             })
            //             .catch(error => console.log(error.message))
            //     })
            //     .catch(error => {
            //         console.log(error.message.data)
            //     })
            // getAllStreams().
            //     then(response => {
            //         console.log(response.data)
            //     })
            //     .catch(error => console.log(error.message))
        })
    }

    async deleteLiveBroadcast(id) {
        try {
            return await this.youtube.liveBroadcasts.delete({
                id,
                access_token: this.oauth2Client.credentials
            })
        } catch (error) {
            console.error(error)
        }
    }

    async insertLiveBroadcast(title, scheduledStartTime, privacyStatus='public') {
        try {
            return await this.youtube.liveBroadcasts.insert({
                part: ['id,snippet,contentDetails,status'],
                contentDetails: {
                    boundStreamId: 'na5YvEy1EoxdqZZqSY5RJw1612744127069367',
                    latencyPreference: 'normal',
                    projection: '360'
                },
                requestBody: {
                    status: {
                        privacyStatus,
                        selfDeclaredMadeForKids: false
                    },
                    snippet: {
                        title,
                        scheduledStartTime
                    }
                },
                access_token: this.oauth2Client.credentials
            })
        } catch (error) {
            console.log(error)
        }
    }

    async deleteLiveStream(id) {
        try {
            return await this.youtube.liveStreams.delete({
                id,
                access_token: this.oauth2Client.credentials
            })
        } catch (error) {
            console.log(error)
        }
    }

    async insertLiveStream(title) {
        try {
            return await this.youtube.liveStreams.insert({
                part: ['id,snippet,cdn,contentDetails,status'],
                requestBody: {
                    snippet: {
                        title
                    },
                    cdn: {
                        frameRate: '30fps',
                        ingestionType: 'rtmp',
                        resolution: '1080p'
                    }
                },
                access_token: this.oauth2Client.credentials
            })
        } catch (error) {
            console.log(error)
        }
    }

    async bindLiveBroadcast(id, streamId) {
        try {
            return await this.youtube.liveBroadcasts.bind({
                part: ['id,snippet,contentDetails,status'],
                id,
                streamId,
                access_token: this.oauth2Client.credentials
            })
        } catch (error) {
            console.log(error)
        }
    }

    async getAllStreams() {
        try {
            return await this.youtube.liveStreams.list({
                part: ['id,snippet,cdn,status'],
                mine: true,
                access_token: this.oauth2Client.credentials
            })
        } catch (error) {
            console.log(error)
        }
    }

    async getAllBroadcasts() {
        try {
            return await this.youtube.liveBroadcasts.list({
                part: ['snippet,contentDetails,status'],
                broadcastStatus: 'all',
                access_token: this.oauth2Client.credentials
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    async updateStream(id, payload) {
        try {
            const {name, start, end, camera} = payload
            
            const stream = StreamModel.findByIdAndUpdate(
                id,
                { name, start, end, camera },
                { new: true }
            )

            return stream
            
        } catch (error) {
            console.error(error)
        }
    }

    async updateStreamStatus(id, status) {
        try {
            const stream = StreamModel.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            )

            return stream

        } catch (error) {
            console.error(error)
        }
    }
}