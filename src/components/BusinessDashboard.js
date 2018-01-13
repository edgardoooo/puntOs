import React, { Component } from 'react';
import { Animated, View, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { getMetrics, getBusinessProfile } from '../actions';
import { Actions } from 'react-native-router-flux';
import BusinessMetric from './BusinessMetric';
import { Card } from './common';
import PieChart from 'react-native-pie-chart';


class BusinessDashboard extends Component {
    componentWillMount(){
        this.props.getMetrics(this.props.uid);
    }

    validSeries (series) {
        for (var i = 0; i < series.length; i++) {
            if (series[i] != 0) {
                return true;
            }
        }
        return false;
    }

    renderPie (chart_wh, series, sliceColor) {
        if (!this.validSeries(series)) {
            return (
                <View style={{ flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
                <Text style={styles.noDataStyle}>No Data</Text>
                </View>
            )
        }
        else {
            return (
                <PieChart
                    chart_wh={chart_wh}
                    series={series}
                    sliceColor={sliceColor}
                />
            )
        }
    }

    render() {

        const { metrics } = this.props;

        console.log('At business dashboard component, the metrics are:')
        console.log(metrics)
        console.log('Check in age distribution:')
        console.log(metrics.checkinAgeDist)

        //CHECKIN INFO
        var checkinYoungAge = metrics.checkinAgeDist.young;
        var checkinMidAge = metrics.checkinAgeDist.mid;
        var checkinSeniorAge = metrics.checkinAgeDist.senior;

        var checkinAgeSeries = [checkinYoungAge, checkinMidAge, checkinSeniorAge];

        var checkinMetroRegion = metrics.checkinRegionDist.metroRegion;
        var checkinNorthRegion = metrics.checkinRegionDist.northRegion;
        var checkinSouthRegion = metrics.checkinRegionDist.southRegion;
        var checkinEastRegion = metrics.checkinRegionDist.eastRegion;
        var checkinWestRegion = metrics.checkinRegionDist.westRegion;
        var checkinCenterRegion = metrics.checkinRegionDist.centerRegion;
        var checkinOtherRegion = metrics.checkinRegionDist.otherRegion;

        var checkinRegionSeries = [checkinMetroRegion, checkinNorthRegion, checkinSouthRegion, checkinEastRegion, checkinWestRegion, checkinCenterRegion, checkinOtherRegion];

        var checkinMorningTime = metrics.checkinTimeDist.morning;
        var checkinAfternoonTime = metrics.checkinTimeDist.afternoon;
        var checkinEveningTime = metrics.checkinTimeDist.evening;

        var checkinTimeSeries = [checkinMorningTime, checkinAfternoonTime, checkinEveningTime];

        //SHARE INFO
        var shareYoungAge = metrics.shareAgeDist.young;
        var shareMidAge = metrics.shareAgeDist.mid;
        var shareSeniorAge = metrics.shareAgeDist.senior;

        var shareAgeSeries = [shareYoungAge, shareMidAge, shareSeniorAge];

        var shareMetroRegion = metrics.shareRegionDist.metroRegion;
        var shareNorthRegion = metrics.shareRegionDist.northRegion;
        var shareSouthRegion = metrics.shareRegionDist.southRegion;
        var shareEastRegion = metrics.shareRegionDist.eastRegion;
        var shareWestRegion = metrics.shareRegionDist.westRegion;
        var shareCenterRegion = metrics.shareRegionDist.centerRegion;
        var shareOtherRegion = metrics.shareRegionDist.otherRegion;

        var shareRegionSeries = [shareMetroRegion, shareNorthRegion, shareSouthRegion, shareEastRegion, shareWestRegion, shareCenterRegion, shareOtherRegion];

        //REDEEM INFO
        var redeemYoungAge = metrics.redeemAgeDist.young;
        var redeemMidAge = metrics.redeemAgeDist.mid;
        var redeemSeniorAge = metrics.redeemAgeDist.senior;

        var redeemAgeSeries = [redeemYoungAge, redeemMidAge, redeemSeniorAge];

        var redeemMetroRegion = metrics.redeemRegionDist.metroRegion;
        var redeemNorthRegion = metrics.redeemRegionDist.northRegion;
        var redeemSouthRegion = metrics.redeemRegionDist.southRegion;
        var redeemEastRegion = metrics.redeemRegionDist.eastRegion;
        var redeemWestRegion = metrics.redeemRegionDist.westRegion;
        var redeemCenterRegion = metrics.redeemRegionDist.centerRegion;
        var redeemOtherRegion = metrics.redeemRegionDist.otherRegion;

        var redeemRegionSeries = [redeemMetroRegion, redeemNorthRegion, redeemSouthRegion, redeemEastRegion, redeemWestRegion, redeemCenterRegion, redeemOtherRegion];

        const chart_wh = 250;
        const sliceColorAgeAndTime = ['#F44336', '#2196F3', '#FFEB3B'];
        const sliceColorRegion = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800', '#6CDCDF', '#F47CBF'];

        //var checkinAgeSeries = [1, 1, 1];
        //var checkinRegionSeries = [1, 1, 1, 1, 1, 1, 1];
        //var checkinTimeSeries = [1, 1, 1];

        //var shareAgeSeries = [1, 1, 1];
        //var shareRegionSeries = [1, 1, 1, 1, 1, 1, 1];

        //var redeemAgeSeries = [1, 1, 1];
        //var redeemRegionSeries = [1, 1, 1, 1, 1, 1, 1];

        return (
            <ScrollView>

                <Card>
                    <View style={styles.container}>
                        <Text style={styles.titleStyle}> Check-ins By Age </Text>
                        {this.renderPie(chart_wh, checkinAgeSeries, sliceColorAgeAndTime)}
                        <View style={{flexDirection: 'row', flex: 1, marginTop: 15}}>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#F44336' }}>{checkinAgeSeries[0]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>young (25-)</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#2196F3' }}>{checkinAgeSeries[1]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>mid (49-)</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#FFEB3B' }}>{checkinAgeSeries[2]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>senior (50+)</Text>
                          </View>
                        </View>
                    </View>
                </Card>

                <Card>
                    <View style={styles.container}>
                        <Text style={styles.titleStyle}> Check-ins By Region </Text>
                        {this.renderPie(chart_wh, checkinRegionSeries, sliceColorRegion)}
                        <View style={{flexDirection: 'row', flex: 1, marginTop: 15}}>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#F44336' }}>{checkinRegionSeries[0]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>metro</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#2196F3' }}>{checkinRegionSeries[1]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>north</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#FFEB3B' }}>{checkinRegionSeries[2]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>south</Text>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', flex: 1, marginTop: 15}}>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#4CAF50' }}>{checkinRegionSeries[3]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>east</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#FF9800' }}>{checkinRegionSeries[4]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>west</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#6CDCDF' }}>{checkinRegionSeries[5]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>center</Text>
                          </View>
                        </View>
                    </View>
                </Card>

                <Card>
                    <View style={styles.container}>
                        <Text style={styles.titleStyle}> Check-ins By Time </Text>
                        {this.renderPie(chart_wh, checkinTimeSeries, sliceColorAgeAndTime)}
                        <View style={{flexDirection: 'row', flex: 1, marginTop: 15}}>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#F44336' }}>{checkinAgeSeries[0]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>morning (-10am)</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#2196F3' }}>{checkinAgeSeries[1]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>afternoon (-6pm)</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#FFEB3B' }}>{checkinAgeSeries[2]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>evening (-12am)</Text>
                          </View>
                        </View>
                    </View>
                </Card>

                <Card>
                    <View style={styles.container}>
                        <Text style={styles.titleStyle}> Shares By Region </Text>
                        {this.renderPie(chart_wh, shareRegionSeries, sliceColorRegion)}
                        <View style={{flexDirection: 'row', flex: 1, marginTop: 15}}>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#F44336' }}>{shareRegionSeries[0]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>metro</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#2196F3' }}>{shareRegionSeries[1]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>north</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#FFEB3B' }}>{shareRegionSeries[2]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>south</Text>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', flex: 1, marginTop: 15}}>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#4CAF50' }}>{shareRegionSeries[3]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>east</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#FF9800' }}>{shareRegionSeries[4]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>west</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#6CDCDF' }}>{shareRegionSeries[5]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>center</Text>
                          </View>
                        </View>
                    </View>
                </Card>

                <Card>
                    <View style={styles.container}>
                        <Text style={styles.titleStyle}> Shares By Age </Text>
                        {this.renderPie(chart_wh, shareAgeSeries, sliceColorAgeAndTime)}
                        <View style={{flexDirection: 'row', flex: 1, marginTop: 15}}>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#F44336' }}>{shareAgeSeries[0]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>young (25-)</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#2196F3' }}>{shareAgeSeries[1]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>mid (49-)</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#FFEB3B' }}>{shareAgeSeries[2]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>senior (50+)</Text>
                          </View>
                        </View>
                    </View>
                </Card>

                <Card>
                    <View style={styles.container}>
                        <Text style={styles.titleStyle}> Coupon Claims By Region </Text>
                        {this.renderPie(chart_wh, redeemRegionSeries, sliceColorRegion)}
                        <View style={{flexDirection: 'row', flex: 1, marginTop: 15}}>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#F44336' }}>{redeemRegionSeries[0]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>metro</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#2196F3' }}>{redeemRegionSeries[1]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>north</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#FFEB3B' }}>{redeemRegionSeries[2]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>south</Text>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', flex: 1, marginTop: 15}}>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#4CAF50' }}>{redeemRegionSeries[3]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>east</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#FF9800' }}>{redeemRegionSeries[4]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>west</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#6CDCDF' }}>{redeemRegionSeries[5]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>center</Text>
                          </View>
                        </View>
                    </View>
                </Card>

                <Card>
                    <View style={styles.container}>
                        <Text style={styles.titleStyle}> Coupon Claims By Age </Text>
                        {this.renderPie(chart_wh, redeemAgeSeries, sliceColorAgeAndTime)}
                        <View style={{flexDirection: 'row', flex: 1, marginTop: 15}}>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#F44336' }}>{redeemAgeSeries[0]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>young (25-)</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#2196F3' }}>{redeemAgeSeries[1]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold'  }}>mid (49-)</Text>
                          </View>
                          <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'column'}}>
                          <Text style={{ alignSelf: 'center', fontSize: 40, color: '#FFEB3B' }}>{redeemAgeSeries[2]}</Text>
                          <Text style={{ alignSelf: 'center', fontWeight: 'bold' }}>senior (50+)</Text>
                          </View>
                        </View>
                    </View>
                </Card>

            </ScrollView>
        );
    }
}

const styles = {

    container: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#fff',
        paddingTop: 10,
        paddingBottom: 20
      },
      titleStyle: {
        alignSelf: 'flex-start',
        marginLeft: 5,
        marginBottom: 20,
        fontSize: 25,
        fontWeight: 'bold'
      },
      noDataStyle: {
        alignSelf: 'center',
        marginLeft: 5,
        marginBottom: 20,
        fontSize: 40,
        fontWeight: 'bold',
        color: '#e3e3e3'
      }
}

const mapStateToProps = state => {
    const { user, uid, metrics} = state.businessMain;
    return { user, uid, metrics};
  };

  export default connect(mapStateToProps,{ getMetrics, getBusinessProfile })(BusinessDashboard);
