import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card, CardSection } from './common';

class BusinessMetric extends Component {
    render() {
        const {
            checkinsCount,
            couponsCount,
            date,
            eastCheckIns,
            eastCoupons,
            highAgeCheckIns,
            highAgeCoupons,
            lowAgeCheckIns,
            lowAgeCoupons,
            midAgeCheckIns,
            midAgeCoupons,
            northCheckIns,
            northCoupons,
            southCheckIns,
            southCoupons,
            westCheckIns,
            westCoupons
        } = this.props.metrics

        return (
            <Card>
                <CardSection style={{borderBottomWidth: 1, padding: 5 }}>
                    <View style={{ flex:1, flexDirection: 'column' }}>
                        <Text style={styles.headerTextStyle}>Check-In Information</Text>
                        <Text style={styles.subHeaderTextStyle}>By Age</Text>
                        <Text style={styles.textStyle}>Retired Age: {highAgeCheckIns}</Text>
                        <Text style={styles.textStyle}>Professional Age: {midAgeCheckIns}</Text>
                        <Text style={styles.textStyle}>College Age: {lowAgeCheckIns}</Text>

                        <Text style={styles.subHeaderTextStyle}>By Geography (Puerto Rico)</Text>
                        <Text style={styles.textStyle}>North: {northCheckIns}</Text>
                        <Text style={styles.textStyle}>East: {eastCheckIns}</Text>
                        <Text style={styles.textStyle}>South: {southCheckIns}</Text>
                        <Text style={styles.textStyle}>West: {westCheckIns}</Text>
                        <Text style={styles.subHeaderTextStyle}>Total Check-Ins: {checkinsCount}</Text>
                    </View>
                </CardSection>

                <CardSection style={{borderBottomWidth: 1, padding: 5 }}>
                    <View style={{ flex:1, flexDirection: 'column' }}>
                        <Text style={styles.headerTextStyle}>Coupon Information</Text>
                        <Text style={styles.subHeaderTextStyle}>By Age</Text>
                        <Text style={styles.textStyle}>Retired Age: {highAgeCoupons}</Text>
                        <Text style={styles.textStyle}>Professional Age: {midAgeCoupons}</Text>
                        <Text style={styles.textStyle}>College Age: {lowAgeCoupons}</Text>

                        <Text style={styles.subHeaderTextStyle}>By Geography (Puerto Rico)</Text>
                        <Text style={styles.textStyle}>North: {northCoupons}</Text>
                        <Text style={styles.textStyle}>East: {eastCoupons}</Text>
                        <Text style={styles.textStyle}>South: {southCoupons}</Text>
                        <Text style={styles.textStyle}>West: {westCoupons}</Text>
                        <Text style={styles.subHeaderTextStyle}>Total Coupons: {couponsCount}</Text>
                    </View>
                </CardSection>
            </Card>
        );
    }
}

const styles = {
    headerTextStyle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0084b4',
    },
    subHeaderTextStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'grey',
    }
}

export default BusinessMetric;
