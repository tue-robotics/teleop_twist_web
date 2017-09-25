#!/usr/bin/env python
import rospy
import sys
import os
import roslib
import socket

DEFAULT_PORT = 8000

os.chdir(roslib.packages.get_pkg_dir('teleop_twist_web'))


# first try to create a twisted server
def create_twisted_server(port, index_names):
    from twisted.web import static, server
    from twisted.internet import reactor

    rospy.loginfo('using TwistedServer')

    root = static.File('.')
    root.index_names = index_names
    root.contentTypes['.woff'] = 'application/font-woff'
    factory = server.Site(root)

    rospy.loginfo("Serving HTTP on 0.0.0.0 port %d ...: " % port)
    reactor.listenTCP(port, factory)

    def shutdown():
        rospy.loginfo('KeyboardInterrupt received, closing the server...')
        if reactor.running:
            reactor.stop()
    rospy.on_shutdown(shutdown)
    reactor.run()


# if that fails, create a create a SimpleHTTPRequestHandler
def create_simple_server(port):
    import SimpleHTTPServer
    import SocketServer

    rospy.loginfo('using SimpleHTTPServer')

    Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
    httpd = SocketServer.TCPServer(("", port), Handler)

    rospy.loginfo("Serving HTTP on 0.0.0.0 port %d ...: " % port)

    def shutdown():
        rospy.loginfo('KeyboardInterrupt received, closing the server...')
        httpd.shutdown()
    rospy.on_shutdown(shutdown)

    try:
        httpd.serve_forever()
    # except KeyboardInterrupt:
    except KeyboardInterrupt:
        shutdown()

if __name__ == '__main__':
    rospy.init_node('teleop_twist_web', anonymous=True, disable_signals=True)

    try:
        port = rospy.get_param('~port', DEFAULT_PORT)
        index_names = rospy.get_param('~index_names', ['index.html'])
        rospy.loginfo('using port %d from parameter server' % port)
        rospy.loginfo('using index names: %s from parameter server' % index_names)
    except socket.error:
        rospy.loginfo('no parameter server running, getting port from argv')
        index_names = ['index.html']
        if len(sys.argv) > 1 and sys.argv[1].isdigit():
            port = int(sys.argv[1])
        else:
            port = DEFAULT_PORT

    try:
        create_twisted_server(port, index_names)
    except ImportError:
        create_simple_server(port)
