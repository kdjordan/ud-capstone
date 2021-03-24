export function formatDate(imageObj) {
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
}
