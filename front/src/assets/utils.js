export function formatDate(imageObj) {
    if(Array.isArray(imageObj)) {
        let newImages = []
        imageObj.forEach(image => {
            newImages.push({
                SK : image.SK,
                PK : image.PK,
                owner: image.owner,
                description: image.description,
                imageUrl: image.imageUrl,
                createdDate: image.createdDate.split("T")[0]
            }
            )
        })
        return newImages
    } else {
        return {
            SK : imageObj.SK,
            PK : imageObj.PK,
            owner: imageObj.owner,
            description: imageObj.description,
            imageUrl: imageObj.imageUrl,
            createdDate: imageObj.createdDate.split("T")[0]
        }
    }
}
