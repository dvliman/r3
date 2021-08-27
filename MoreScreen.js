import React from 'react';
import {
  Container,
  Content,
  Text,
  Left,
  Button,
  View,
  Thumbnail,
  List,
  ListItem,
} from 'native-base';
export default function MoreScreen() {
  return (
    <Container>
      <Content style={style.content}>
        <View>
          <List>
            {items.slice(0, 4).map((item) => {
              return (
                <ListItem
                  key={item.id}
                  style={style.listItem}
                  onPress={item.action}
                >
                  <Left>
                    <Thumbnail
                      style={style.listIcon}
                      source={item.icon}
                      square
                    />
                    <View>
                      <Text style={style.listText}>{item.text}</Text>
                      <Text style={style.listSubtext}>{item.subtext}</Text>
                    </View>
                  </Left>
                  <View>
                    <Thumbnail
                      style={style.listArrowIcon}
                      source={Theme.icons.white.arrow}
                      square
                    />
                  </View>
                </ListItem>
              );
            })}

            <View
              style={{
                height: 15,
                backgroundColor: Theme.colors.background,
                padding: 0,
              }}
            />

            {items.slice(4).map((item) => {
              return (
                <ListItem
                  key={item.id}
                  style={style.listItem}
                  onPress={item.action}
                >
                  <Left>
                    <Thumbnail
                      style={style.listIcon}
                      source={item.icon}
                      square
                    />
                    <View>
                      <Text style={style.listText}>{item.text}</Text>
                      <Text style={style.listSubtext}>{item.subtext}</Text>
                    </View>
                  </Left>
                  <View>
                    <Thumbnail
                      style={style.listArrowIcon}
                      source={Theme.icons.white.arrow}
                      square
                    />
                  </View>
                </ListItem>
              );
            })}
          </List>
        </View>
      </Content>
    </Container>
  );
}
