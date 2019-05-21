'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImagesSchema extends Schema {
  up () {
    this.create('images', (table) => {
      table.increments()
      table.string('image_name')
      table.string('image_height')
      table.string('image_width')
      table.string('image_size')
      table.string('image_ext')
      table.string('uploaded_by')
      table.string('lattitude')
      table.string('longitude')
      table.timestamps()
    })
  }

  down () {
    this.drop('images')
  }
}

module.exports = ImagesSchema
