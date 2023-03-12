'''
Author: leo4048111
Date: 2023-03-01 13:44:51
LastEditTime: 2023-03-07 20:49:41
LastEditors: ***
Description: tornado server main
FilePath: \tornado-bilibili-data-fetcher-analysis-persistence\server.py
'''
#!/usr/bin/python
# -*- coding: utf-8 -*-
import tornado.httpserver
import tornado.ioloop
import tornado.web
from tornado.options import define, options

import os
import mimetypes

mimetypes.init([r'./mime.types'])

class MainHandle(tornado.web.RequestHandler):
    def get(self):
        self.redirect('/templates/piano.html')

static_handlers = [(r"/templates/(.*)", tornado.web.StaticFileHandler, {"path": os.path.join(os.path.dirname(__file__), "templates")}),
                   (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": os.path.join(os.path.dirname(__file__), "static")}),
                   (r"/", MainHandle)]

settings = {
    'debug': False
    }
define("port", default=8888, help="run on the given port", type=int)

class url_route(object):
    '''
    tornado url class
    '''

    def __init__(self):
        self.route_tables = []

    def _generate_handle_table(self):
        '''
        assemble the routes in the route table
        '''
        for sh in static_handlers:
            self.route_tables.append(sh)

    def get_all_route(self):
        '''
        route table
        '''
        self._generate_handle_table()
        print(self.route_tables,)
        return self.route_tables

options.parse_command_line()
application = tornado.web.Application(url_route().get_all_route(), **settings)

if __name__ == '__main__':
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
