/**
 * Copyright (c) Jupyter Development Team.
 * Distributed under the terms of the Modified BSD License.
 */

var sinon = require('sinon');
var chai = require('chai').use(require('sinon-chai'));
var expect = chai.expect;
var request = require('request');
var fs = require('fs');
var path = require('path');
var urljoin = require('url-join');

// env vars
var appUrl = process.env.APP_URL;

describe('Upload and list notebooks', function() {

    it('should successfully render dashboard/notebooks table view', function(done) {
        request.get({
            uri: urljoin(appUrl + '/notebooks')
        }, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.contain('<!doctype html>');
            expect(body).to.contain('Dashboards');
            done();
        });
    });

    it('should list the uploaded notebook', function(done) {
         var datapath = path.join(__dirname, '../resources/upload-notebook-test.ipynb');
         var formData = {
             file: fs.createReadStream(datapath)
         };

         request.post({
             url: urljoin(appUrl, '/notebooks/upload-notebook-test'),
             formData: formData
         }, function(error, response, body) {
             expect(response.statusCode).to.equal(201);
             request.get({
                 url: urljoin(appUrl, '/notebooks')
                 }, function(error, response, body) {
                     expect(response.statusCode).to.equal(200);
                     expect(body).to.contain('<!doctype html>');
                     expect(body).to.contain('upload-notebook-test.ipynb');
                     done();
                 });
         });
     });

      it('should render the dashboards list view on the /notebooks path when an index notebook exists (note case insensitive index names are allowed)', function(done) {
           var datapath = path.join(__dirname, '../resources/InDex.ipynb');
           var formData = {
               file: fs.createReadStream(datapath)
           };

           request.post({
               url: urljoin(appUrl, '/notebooks/InDex'),
               formData: formData
           }, function(error, response, body) {
               expect(response.statusCode).to.equal(201);
               request.get({
                   url: urljoin(appUrl, '/notebooks')
                   }, function(error, response, body) {
                       expect(response.statusCode).to.equal(200);
                       expect(body).to.contain('<!doctype html>');
                       expect(body).to.contain('Dashboards');
                       expect(body).to.contain('InDex.ipynb');
                       done();
                   });
           });
       });

     it('should not render the dashboards list view on the base path when an index notebook exists (note case insensitive index names are allowed)', function(done) {
          var datapath = path.join(__dirname, '../resources/InDex.ipynb');
          var formData = {
              file: fs.createReadStream(datapath)
          };

          request.post({
              url: urljoin(appUrl, '/notebooks/InDex'),
              formData: formData
          }, function(error, response, body) {
              expect(response.statusCode).to.equal(201);
              request.get({
                  url: appUrl
                  }, function(error, response, body) {
                      expect(response.statusCode).to.equal(200);
                      expect(body).to.contain('<!doctype html>');
                      expect(body).to.not.contain('Dashboards');
                      done();
                  });
          });
      });
});