import { useQuery } from '@apollo/client'
import {
  createStyles,
  Grid,
  List,
  ListItem,
  makeStyles,
  Theme,
} from '@material-ui/core'
import gql from 'graphql-tag'
import Head from 'next/head'
import User from 'components/User'
import { MenuHeading } from 'components/Menu'
import { Pagination } from '@material-ui/lab'
import { useState } from 'react'
import { useEffect } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      minHeight: '100vh',
    },
    title: {
      textAlign: 'left',
    },
    content: {
      marginBottom: '20px',
      textAlign: 'center',
    },
    pagination: {
      display: 'inline-block',
    },
  })
)

const LIST_MENU = gql`
  {
    menus {
      id
      level
      aim
      description
      createdAt
      group {
        id
        name
      }
    }
  }
`
type Menu = {
  id: number
  level: string
  aim: string
  description: string
}

const perPage = 10

export default function Home() {
  const classes = useStyles()
  const { loading, error, data } = useQuery(LIST_MENU)
  const [displayMenus, setDisplayMenus] = useState<Menu[]>()

  const allMenus = data ? data.menus : null

  useEffect(() => {
    if (allMenus) {
      setDisplayMenus(allMenus.slice(0, perPage))
    }
  }, [data])

  const handlePaginate = (e: object, currentPage: number) => {
    setDisplayMenus(
      allMenus.slice(perPage * (currentPage - 1), perPage * currentPage)
    )
  }

  if (!data || loading) return <p>Loading...</p>

  return (
    <div className={classes.root}>
      <Head>
        <title>Swistory</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Grid container justify="center" className={classes.content}>
        <Grid item xs={12} md={8}>
          <User />
        </Grid>
      </Grid>
      <Grid container justify="center" className={classes.content}>
        <Grid item xs={12} md={8}>
          <List>
            {displayMenus?.map((menu) => (
              <ListItem>
                <MenuHeading menu={menu} />
              </ListItem>
            ))}
          </List>
          <Pagination
            count={10}
            onChange={handlePaginate}
            className={classes.pagination}
          />
        </Grid>
      </Grid>
    </div>
  )
}