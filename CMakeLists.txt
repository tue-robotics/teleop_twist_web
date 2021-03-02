cmake_minimum_required(VERSION 3.0.2)
project(teleop_twist_web)
find_package(catkin REQUIRED)
catkin_package()

catkin_install_python(PROGRAMS webserver.py
                      DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION})
