'use strict'

// Bring in model
const Image = use('App/Models/Image')
const Helpers = use('Helpers')
const ExifImage = use('exif').ExifImage
const sizeOf = use('image-size')



class HomeController {
    //index call
    async index({ view }){
        return view.render('home')
    }

    //images call
    async images({ view }){

        const images = await Image.all();

        return view.render('images',{
            images : images.toJSON()
        })
    }

    //upload images call
    async store({request ,response, session}){
        const profilePic = request.file('userfile', {
            types: ['jpg','png','jpeg'],
            size: '10mb'
          })

        await profilePic.move(Helpers.publicPath('uploads'), {
        overwrite: true
        })

        if (!profilePic.moved()) {
            return profilePic.error()
          }else{

              const filename = profilePic.fileName

              const filepath =  Helpers.publicPath('uploads/'+filename)

              //try to get exif data from image
            try {
                    const exifData =  ExifImage({ image : filepath }, function (error, exifData) {
                        if (error)
                            return error
                        else
                            return exifData
                    });

                } catch (error) {
                    return error.message
                }


            //get height and width 
            const dimensions = sizeOf(filepath);

                
            //saving to database
              const image = new Image();

              image.image_name = filename
              image.image_height = dimensions.height
              image.image_width = dimensions.width
              image.image_size = profilePic.size
              image.image_ext = profilePic.extname
              image.uploaded_by = request.input('upload_by')
              image.lattitude = request.input('lattitude')?request.input('lattitude'):'31.1471305'
              image.longitude = request.input('longitude')?request.input('longitude'):'75.34121789999999'

              await image.save()

            
          }
    }

    //calling map
    async map({ params,view }){
        const image = await Image.find(params.id)

        return view.render('location',{
            image : image
        })
        
    }
}

module.exports = HomeController
