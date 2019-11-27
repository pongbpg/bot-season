import database, { storage } from '../firebase/firebase';
export const startUploadAvatar = (data) => {
    return (dispatch) => {
        const name = data.imageFile.name.split('.');
        const typefile = name[name.length - 1];
        return storage.ref('emails').child(`${data.email}.${typefile}`).put(data.imageFile)
            .then(snapshot => {
                console.log(snapshot)
                return storage.ref('emails').child(`${data.email}.${typefile}`)
                    .getDownloadURL()
                    .then(function (url) {
                        // Insert url into an <img> tag to "download"
                        // console.log(url)
                        const imgUrl = url;//snapshot.metadata.downloadURLs[0];
                        return database.collection('emails').doc(data.uid).update({ imgUrl })
                    })

            })
    }
}